'use strict';

import { config } from './config';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';
import PinsHelper from 'helpers/pinsHelper';

export default class Map {
    constructor() {
        this.init();
    }

    init() {
        //TODO: Refactor config object structure
        //Config.init( this );

        this.listeners = {};
        this.viewNode = document.querySelector( '.js-map' );
        this.gmap = {};
        this.btnBackToLevel = this.viewNode.querySelector('.js-back-to-level');

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.levelChanged;
        mediatorEvent.level = 0;
        mediatorEvent.pinType = PinNames.destination;
        mediatorEvent.tabName = TabNames.overview;
        config.mediator.stateChanged( mediatorEvent );

        this._attachEvents();
    }

    destroy() {
        this._detachEvents();
        console.log( this );
    }

    drawAllPins() {
        config.currentTab.getPinStrategies().forEach( strategy => {
            this._drawPinsByStrategy( strategy );
        } );
        config.map.updatePinsVisibility();
    }

    removeAllPins() {
        config.pinsArray.forEach( pin => {
            config.googleMap.removeMarker( pin );
        });
    }

    hideAllPins() {
        config.pinsArray.forEach( pin => {
            if ( pin.marker ) {
                pin.marker.classList.remove( 'is-visible' );
            }
        });
    }

    updatePinsVisibility() {
        config.currentTab.getPinStrategies().forEach( strategy => {
            this._updatePinsVisibilityByStrategy( strategy );
        } );
    }

    updateBtnBackToLevelVisibility( isVisible ) {

        if ( isVisible ) {
            this.btnBackToLevel.classList.remove('is-hidden');
        } else {
            this.btnBackToLevel.classList.add('is-hidden');
        }
    }

    _drawPinsByStrategy( strategy ) {
        let currentPinStrategy = config.pinStrategies[strategy],
        pins = currentPinStrategy.generateMultiplePins();

        pins.forEach( pin => {
            config.googleMap.addMarker( pin );
        } );
    }

    _updatePinsVisibilityByStrategy( strategy ) {
        let currentPinStrategy = config.pinStrategies[strategy],
            pins = currentPinStrategy.generateMultiplePins();

        pins.forEach( pin => {

            if ( currentPinStrategy.checkPinVisibility( pin ) ) {
                pin.marker.classList.add('is-visible');

                if ( pin.view ) {
                    pin.view.classList.add('is-visible');
                }

            } else {
                pin.marker.classList.remove('is-visible');

                if ( pin.view ) {
                    pin.view.classList.remove( 'is-visible' );
                }
            }
        } );
    }

    _attachEvents() {
        this.viewNode.addEventListener(
            'click',
            this.listeners.onPinClickHandler = event => this._onPinClickHandler( event, 'js-marker' )
        );
        this.viewNode.addEventListener(
            'click',
            this.listeners.onPinClickHandler = event => this._onPinClickHandler( event, 'js-view' )
        );
        this.viewNode.addEventListener(
            'mouseover',
            ( event, cssClass ) => this._onPinMouseoverHandler( event, 'js-marker' )
        );
        this.viewNode.addEventListener(
            'mouseover',
            ( event, cssClass ) => this._onPinMouseoverHandler( event, 'js-view' )
        );
        this.viewNode.addEventListener(
            'mouseout',
            ( event, cssClass ) => this._onPinMouseoutHandler( event, 'js-marker' )
        );
        this.viewNode.addEventListener(
            'mouseout',
            ( event, cssClass ) => this._onPinMouseoutHandler( event, 'js-view' )
        );
        this.viewNode.addEventListener(
            'click',
            this.listeners.onBtnLevelBackClickHandler = event => this._onBtnLevelBackClickHandler( event, 'js-back-to-level' )
        );
        this.viewNode.addEventListener(
            'click',
            this.listeners.onClickBtnViewOnMapHandler = event => this._onClickBtnViewOnMapHandler( event, 'js-view-on-map')
        );
    }

    _detachEvents() {
        this.viewNode.removeEventListener(
            'click',
            this.listeners.onPinClickHandler
        );
        // config.map.removeEventListener('click', event => this._onPinClickHandler(event) );
        // config.map.removeEventListener('mouseover', event => this._onPinMouseOverHandler(event) );
        this.listeners = null;
    }

    _onPinClickHandler( event, cssClass ) {
        let pin = this._getEventTargetPin( event, cssClass );

        if ( !pin ) {
            return false;
        }

        config.pinStrategies[pin.type].onPinClick( pin );
    }

    _onPinMouseoverHandler( event, cssClass ) {
        let pin = this._getEventTargetPin( event, cssClass );

        if ( !pin ) {
            return false;
        }

        config.pinStrategies[pin.type].onPinMouseover( pin );
    }

    _onPinMouseoutHandler( event, cssClass ) {
        let pin = this._getEventTargetPin( event, cssClass );

        if ( !pin ) {
            return false;
        }

        config.pinStrategies[pin.type].onPinMouseout( pin );
    }

    _onBtnLevelBackClickHandler( event, cssClass ) {
        let target = this._findNodeByCssClass( event.target, 'js-map', cssClass );

        if ( !target ) {
            return false;
        }

        let targetLocation = config.locationsHistory.pop();

        if ( !targetLocation ) {
            return false;
        }

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.levelChanged;
        mediatorEvent.level = targetLocation.levelId;
        mediatorEvent.pinType = PinNames.destination;
        mediatorEvent.targetPin = targetLocation;
        config.mediator.stateChanged( mediatorEvent );
    }

    _onClickBtnViewOnMapHandler( event, cssClass ){
        let target = this._findNodeByCssClass( event.target, 'js-map', cssClass );

        if ( !target ) {
            return false;
        }

        console.log('view on map handler');

        let pin = this._getEventTargetPin( event, cssClass );

        if ( !pin ) {
            return false;
        }

        config.googleMap.setCenter({
            lat: pin.lat,
            lng: pin.lng
        });
        //TODO: remove active pin styles, stroe active pin
        config.pinStrategies[pin.type].addActiveClass( pin );
    }

    _findNodeByCssClass( currentNode, rootClass, cssClass ) {

        while ( !currentNode.classList.contains( rootClass ) ) {
            if ( currentNode.classList.contains( cssClass ) ) {
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }

        return null;
    }

    _getEventTargetPin( event, cssClass ) {
        let target = this._findNodeByCssClass( event.target, 'js-map', cssClass );

        if ( !target ) {
            return null;
        }

        let id = target.getAttribute( 'data-id' );

        return PinsHelper.findPin( id );
    }
}



