'use strict';

import { config } from './config';
import LevelNames from './enums/levelNames';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';
import PinsHelper from './helpers/pinsHelper';

export default class DestMapControl {
    constructor() {
        this.init();
    }

    init() {
        this.listeners = {};
        this.viewNode = document.querySelector( '.js-map' );
        this.btnBackToLevel = this.viewNode.querySelector('.js-back-to-level');

        this._attachEvents();
    }

    initLevel() {
        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.levelChanged;
        mediatorEvent.levelName = LevelNames.world;
        mediatorEvent.pinType = PinNames.destination;
        mediatorEvent.tabName = TabNames.overview;
        config.mediator.stateChanged( mediatorEvent );
    }

    destroy() {
        this._detachEvents();
        console.log( this );
    }

    drawAllPins() {
        config.tabs.currentTab.getPinStrategies().forEach( strategy => {
            this._drawPinsByStrategy( strategy );
        } );
        config.maps.destMapControl.updatePinsVisibility();
    }

    removeAllPins() {
        config.pins.data.forEach( pin => {
            config.maps.googleMapControl.removeMarker( pin );
        });
    }

    hideAllPins() {
        config.pins.data.forEach( pin => {
            if ( pin.marker ) {
                pin.marker.classList.remove( 'is-visible' );
            }
        });
    }

    updatePinsVisibility() {
        config.tabs.currentTab.getPinStrategies().forEach( strategy => {
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

    updateFiltersVisibility( levelName ) {

        if ( levelName === LevelNames.world ) {
            config.filters.filterAirportControl.updateVisibility( true );
            config.filters.filterHolidayTypeControl.updateVisibility( true );
        } else {
            config.filters.filterAirportControl.updateVisibility( false );
            config.filters.filterHolidayTypeControl.updateVisibility( false );
        }
    }

    _drawPinsByStrategy( strategy ) {
        let currentPinStrategy = config.pins.strategies[strategy],
        pins = currentPinStrategy.generateMultiplePins();

        pins.forEach( pin => {
            config.maps.googleMapControl.addMarker( pin );
        } );
    }

    _updatePinsVisibilityByStrategy( strategy ) {
        let currentPinStrategy = config.pins.strategies[strategy],
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

        config.pins.strategies[pin.type].onPinClick( pin );
    }

    _onPinMouseoverHandler( event, cssClass ) {
        let pin = this._getEventTargetPin( event, cssClass );

        if ( !pin ) {
            return false;
        }

        config.pins.strategies[pin.type].onPinMouseover( pin );
    }

    _onPinMouseoutHandler( event, cssClass ) {
        let pin = this._getEventTargetPin( event, cssClass );

        if ( !pin ) {
            return false;
        }

        config.pins.strategies[pin.type].onPinMouseout( pin );
    }

    _onBtnLevelBackClickHandler( event, cssClass ) {
        let target = this._findNodeByCssClass( event.target, 'js-map', cssClass );

        if ( !target ) {
            return false;
        }

        let targetLocation = config.levels.locationsHistory.pop();

        if ( !targetLocation ) {
            return false;
        }

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.levelChanged;
        mediatorEvent.levelName = config.levels.order[ targetLocation.id ];
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

        config.maps.googleMapControl.setCenter({
            lat: pin.lat,
            lng: pin.lng
        });

        let activePin = config.pins.activePin;

        if ( activePin ) {
            config.pins.strategies[activePin.type].removeActiveClass(activePin);
        }

        config.pins.activePin = pin;
        config.pins.strategies[pin.type].addActiveClass( pin );
    }

    _findNodeByCssClass( currentNode, rootClass, cssClass ) {

        while ( currentNode && !currentNode.classList.contains( rootClass ) ) {
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



