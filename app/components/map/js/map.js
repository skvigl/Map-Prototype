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
import AjaxHandler from 'ajaxHandler';
import PinsHelper from 'pinsHelper';


export default class Map {
    constructor() {

    }

    init() {
        this.listeners = {};
        Config.instance.map = this;
        this.viewNode = document.querySelector( '.js-map' );
        this.gmap = {};
        this.gmap.viewNode = this.viewNode.querySelector( '.js-gmap' );
        this.btnBackToLevel = this.viewNode.querySelector('.js-back-to-level');
        Config.instance.tabSelect = new TabSelect();
        Config.instance.ajaxHandler = new AjaxHandler();
        Config.instance.mediator = new Mediator();
        Config.instance.currentHolidayType = HolidayTypeNames.beach;
        //Config.instance.pinsArray = this._getMarkers();

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
        this.gmap.viewNode.innerHTML = '';
        Config.instance.currentTab.getPinStrategies().forEach( strategy => {
            this._drawPins( strategy );
        } );
    }

    updateBtnBackToLevelVisibility( isVisible ) {

        if ( isVisible ) {
            this.btnBackToLevel.classList.remove('is-hidden');
        } else {
            this.btnBackToLevel.classList.add('is-hidden');
        }
    }

    _drawPins( strategy ) {
        let pins = Config.instance.pinStrategies[strategy].generateMultiplePins();
        pins.forEach( pin => {
            this.gmap.viewNode.appendChild( pin.marker );
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

        console.log('btn back clicked ');

        let targetLocation = Config.instance.locationsHistory.pop();

        if ( !targetLocation ) {
            return false;
        }

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.levelChanged;
        mediatorEvent.level = targetLocation.levelId;
        mediatorEvent.pinType = PinNames.destination;
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



