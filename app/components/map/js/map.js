'use strict';

import Config from './config';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';
import LevelsFactory from './levelsStrategies/levelsFactory';
import TabsFactory from './tabsStrategies/tabsFactory';
import PinsFactory from './pinsStrategies/pinsFactory';
import Mediator from 'mediator';
import TabSelect from 'tabSelect';
import FilterAirport from 'filterAirport';
import FilterHolidayType from 'filterHolidayType';
import AjaxHandler from 'ajaxHandler';
import PinsHelper from 'pinsHelper';


export default class Map {
    constructor() {

    }

    init() {
        //TODO: Create initialisation for components
        //TODO: Refactor config object structure
        this.listeners = {};
        Config.instance.map = this;
        this.viewNode = document.querySelector( '.js-map' );
        this.gmap = {};
        this.gmap.viewNode = this.viewNode.querySelector( '.js-gmap' );
        this.btnBackToLevel = this.viewNode.querySelector('.js-back-to-level');
        Config.instance.tabSelect = new TabSelect();
        Config.instance.filterAirport = new FilterAirport();
        Config.instance.filterHolidayType = new FilterHolidayType();
        Config.instance.ajaxHandler = new AjaxHandler();
        Config.instance.mediator = new Mediator();
        Config.instance.currentHolidayType = HolidayTypeNames.beach;

        Config.instance.levelCollections.forEach( ( level ) => {
            level.strategy = LevelsFactory.getLevelStrategies( level.levelId );
            level.tabs = level.strategy.getTabs();
        } );

        Config.instance.tabStrategies = {
            [ TabNames.overview ]: TabsFactory.getTabStrategy( TabNames.overview ),
            [ TabNames.pois ]: TabsFactory.getTabStrategy( TabNames.pois ),
            [ TabNames.hotels ]: TabsFactory.getTabStrategy( TabNames.hotels ),
            [ TabNames.villas ]: TabsFactory.getTabStrategy( TabNames.villas )
        };

        Config.instance.pinStrategies = {
            [ PinNames.airport ]: PinsFactory.getPinStrategy( PinNames.airport ),
            [ PinNames.destination ]: PinsFactory.getPinStrategy( PinNames.destination ),
            [ PinNames.childDestination ]: PinsFactory.getPinStrategy( PinNames.childDestination ),
            [ PinNames.poi ]: PinsFactory.getPinStrategy( PinNames.poi ),
            [ PinNames.hotel ]: PinsFactory.getPinStrategy( PinNames.hotel )
        };

        Config.instance.tabSelect.init();
        Config.instance.tabSelect.setMediator( Config.instance.mediator );
        Config.instance.filterAirport.setMediator( Config.instance.mediator );
        Config.instance.filterHolidayType.setMediator( Config.instance.mediator );

        Config.instance.filterParams = {
            airportId: Config.instance.filterAirport.getValue(),
            holidayType: Config.instance.filterHolidayType.getValue()
        };

        console.log( Config.instance );

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.levelChanged;
        mediatorEvent.level = 0;
        mediatorEvent.pinType = PinNames.destination;
        mediatorEvent.tabName = TabNames.overview;
        Config.instance.mediator.stateChanged( mediatorEvent );

        this._attachEvents();
    }

    destroy() {
        this._detachEvents();
        console.log( this );
    }

    drawAllPins() {

        Config.instance.currentTab.getPinStrategies().forEach( strategy => {
            this._drawPinsByStrategy( strategy );
        } );
        Config.instance.map.updatePinsVisibility();
    }

    removeAllPins() {
        this.gmap.viewNode.innerHTML = '';
    }

    hideAllPins() {
        Config.instance.pinsArray.forEach( pin => {
            if ( pin.marker ) {
                pin.marker.classList.remove( 'is-visible' );
            }
        });
    }

    updatePinsVisibility() {
        Config.instance.currentTab.getPinStrategies().forEach( strategy => {
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
        let currentPinStrategy = Config.instance.pinStrategies[strategy],
        pins = currentPinStrategy.generateMultiplePins();

        pins.forEach( pin => {
            this.gmap.viewNode.appendChild( pin.marker );
        } );
    }

    _updatePinsVisibilityByStrategy( strategy ) {
        let currentPinStrategy = Config.instance.pinStrategies[strategy],
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
    }

    _detachEvents() {
        this.viewNode.removeEventListener(
            'click',
            this.listeners.onPinClickHandler
        );
        // Config.instance.map.removeEventListener('click', event => this._onPinClickHandler(event) );
        // Config.instance.map.removeEventListener('mouseover', event => this._onPinMouseOverHandler(event) );
        this.listeners = null;
    }

    _onPinClickHandler( event, cssClass ) {
        let pin = this._getEventTargetPin( event, cssClass );

        if ( !pin ) {
            return false;
        }

        Config.instance.pinStrategies[pin.type].onPinClick( pin );
    }

    _onPinMouseoverHandler( event, cssClass ) {
        let pin = this._getEventTargetPin( event, cssClass );

        if ( !pin ) {
            return false;
        }

        Config.instance.pinStrategies[pin.type].onPinMouseover( pin );
    }

    _onPinMouseoutHandler( event, cssClass ) {
        let pin = this._getEventTargetPin( event, cssClass );

        if ( !pin ) {
            return false;
        }

        Config.instance.pinStrategies[pin.type].onPinMouseout( pin );
    }

    _onBtnLevelBackClickHandler( event, cssClass ) {
        let target = this._findNodeByCssClass( event.target, 'js-map', cssClass );

        if ( !target ) {
            return false;
        }

        let targetLocation = Config.instance.locationsHistory.pop();

        if ( !targetLocation ) {
            return false;
        }

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.levelChanged;
        mediatorEvent.level = targetLocation.levelId;
        mediatorEvent.pinType = PinNames.destination;
        mediatorEvent.targetPin = targetLocation;
        Config.instance.mediator.stateChanged( mediatorEvent );
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



