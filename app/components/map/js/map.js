'use strict';

import Config from './config';
import PinNames from './enums/pinNames';
import LevelsFactory from './levelsStrategies/levelsFactory';
import Mediator from 'mediator';
import LevelSelect from './levelSelect';
import TabSelect from 'tabSelect';
import AjaxHandler from 'ajaxHandler';
import PinFactory from './pinsStrategies/pinsFactory';

export default class Map {
    constructor() {
    }

    init() {

        Config.instance.map = document.querySelector('.js-map');
        Config.instance.levelSelect = new LevelSelect();
        Config.instance.tabSelect = new TabSelect();
        Config.instance.ajaxHandler = new AjaxHandler();
        Config.instance.mediator = new Mediator();
        Config.instance.pinsArray = this._getMarkers();

        Config.instance.levelCollections.forEach( ( level ) => {
            level.strategy = LevelsFactory.getLevelStrategies( level.levelId );
            level.tabs = level.strategy.getTabs();
        });

        Config.instance.pinStrategies = {
            [ PinNames.airport ]: PinFactory.getPinStrategy( PinNames.airport ),
            [ PinNames.destination ]: PinFactory.getPinStrategy( PinNames.destination ),
            [ PinNames.poi ]: PinFactory.getPinStrategy( PinNames.poi ),
            [ PinNames.hotel ]: PinFactory.getPinStrategy( PinNames.hotel )
        };


        this.initMapAtLevel( 0, 'overview' );

        Config.instance.levelSelect.init();
        Config.instance.tabSelect.init();

        Config.instance.mediator.addInitiator( 'levelSelect', Config.instance.levelSelect );
        Config.instance.mediator.addInitiator( 'tabSelect' , Config.instance.tabSelect );
        Config.instance.mediator.addInitiator( 'map' , this );

        Config.instance.levelSelect.setMediator( Config.instance.mediator );
        Config.instance.tabSelect.setMediator( Config.instance.mediator );


        console.log( Config.instance );

        this.drawAllPins();
        this._bindEvents();
        //this._unbindEvents();
        //this._bindEvents();
    }

    _getMarkers() {
        return [
            { id: '1', type: PinNames.hotel, text: 'HOTEL1'},
            { id: '2', type: PinNames.poi, text: 'POI1'},
            { id: '3', type: PinNames.destination, text: 'Majorca', summary: 'Lorem ipsum dolor sit amet.'},
            { id: '4', type: PinNames.destination, text: 'Minorca'},
            { id: '5', type: PinNames.destination, text: 'Ibiza'},
            { id: '6', type: PinNames.destination, text: 'Chelyabinsk', holidayType: 'cityBreak'},
            { id: '7', type: PinNames.poi, text: 'POI2'},
            { id: '8', type: PinNames.airport, text: 'AIRPORT1'},
            { id: '9', type: PinNames.airport, text: 'AIRPORT2'},
            { id: '10', type: PinNames.airport, text: 'AIRPORT3'},
            { id: '11', type: PinNames.hotel, text: 'HOTEL2'},
            { id: '12', type: PinNames.hotel, text: 'HOTEL3'},
            { id: '13', type: PinNames.hotel, text: 'HOTEL4'},
            { id: '14', type: PinNames.hotel, text: 'HOTEL5'}
        ];
    }

    destroy() {

    }

    initMapAtLevel( level, tab ) {
        Config.instance.currentLevel = Config.instance.levelCollections[ level ];
        Config.instance.currentTab = Config.instance.currentLevel.tabs[ tab ];
    }

    drawAllPins() {
        Config.instance.map.innerHTML = '';
        Config.instance.currentTab
            .getPinStrategies()
            .forEach( ( strategy ) => {
                this._drawPins( strategy );
        });
    }

    _drawPins( strategy ) {
        let pins = Config.instance.pinStrategies[ strategy ].generateMultiplePins();
        pins.forEach( pin => {
            Config.instance.map.append( pin );
        })
    }

    _bindEvents() {
        Config.instance.map.addEventListener('click', event => this._onPinClickHandler(event));
        //Config.instance.map.addEventListener('mouseover', event => this._onPinMouseOverHandler(event));
    }

    _unbindEvents() {
        Config.instance.map.removeEventListener('click', event => this._onPinClickHandler(event) );
        Config.instance.map.removeEventListener('mouseover', event => this._onPinMouseOverHandler(event) );
    }

    _onPinClickHandler( event ) {
        let target = event.target;
        let id = null;
        //console.log( event.target );


        while( !target.classList.contains( 'js-map' ) ) {
            if ( target.classList.contains( 'js-marker' ) ) {
                console.log('pin clicked');
                //console.log(target);
                id = target.getAttribute('data-id');
                break;
            }
            target = target.parentNode;
        }

        let pin = this._findMarker( id );
        console.log( pin );

        //Config.instance.currentTab.
    }

    _onPinMouseOverHandler( event ) {
        let target = event.target;
        let id = null;
        //console.log( event.target );


        while( !target.classList.contains( 'js-map' ) ) {
            if ( target.classList.contains( 'js-marker' ) ) {
                console.log('pin mouse over');
                console.log(target);
                id = target.getAttribute('data-id');
                break;
            }
            target = target.parentNode;
        }

        let pin = this._findMarker( id );
        console.log( pin );
    }

    _findMarker( id ) {
        let pins = Config.instance.pinsArray;

        for( let i = 0, imax = pins.length; i < imax; i++ ) {
            if ( pins[i].id === id ) {
                return pins[i];
            }
        }

        return null;
    }
}



