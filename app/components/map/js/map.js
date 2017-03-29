'use strict';

import Config from './config';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import LevelsFactory from './levelsStrategies/levelsFactory';
import TabsFactory from './tabsStrategies/tabsFactory';
import PinsFactory from './pinsStrategies/pinsFactory';
import Mediator from 'mediator';
import TabSelect from 'tabSelect';
import AjaxHandler from 'ajaxHandler';


export default class Map {
    constructor() {
    }

    init() {
        Config.instance.map = this;
        Config.instance.map.elem = document.querySelector('.js-map');
        Config.instance.tabSelect = new TabSelect();
        Config.instance.ajaxHandler = new AjaxHandler();
        Config.instance.mediator = new Mediator();
        Config.instance.pinsArray = this._getMarkers();

        Config.instance.levelCollections.forEach( ( level ) => {
            level.strategy = LevelsFactory.getLevelStrategies( level.levelId );
            level.tabs = level.strategy.getTabs();
        });

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

        this.initMapAtLevel( 0, TabNames.overview );

        this.drawAllPins();
        this._bindEvents();
        //this._unbindEvents();
        //this._bindEvents();
        //this.villas();
    }

    destroy() {

    }

    initMapAtLevel( level, tabName ) {
        Config.instance.currentLevel = Config.instance.levelCollections[ level ];
        Config.instance.currentLevelId = Config.instance.levelCollections[ level ];
        Config.instance.currentTab = Config.instance.tabStrategies[ tabName ];
        Config.instance.currentHolidayType = HolidayTypeNames.beach;
        Config.instance.tabSelect.setTabsVisibility( Config.instance.currentLevel.tabs );
        Config.instance.tabSelect.setActiveTab( Config.instance.currentLevel.tabs[0] );

        let content = Config.instance.currentTab.generateContent();
        Config.instance.tabSelect.updateTabContent( content );
    }

    drawAllPins() {
        Config.instance.map.elem.innerHTML = '';
        Config.instance.currentTab.getPinStrategies().forEach( strategy => {
            this._drawPins( strategy );
        });
    }

    _drawPins( strategy ) {
        let pins = Config.instance.pinStrategies[ strategy ].generateMultiplePins();
        pins.forEach( pin => {
            //console.log(document.createElement(pin));
            Config.instance.map.elem.appendChild( pin.marker );
        })
    }

    _bindEvents() {
        Config.instance.map.elem.addEventListener('click', event => this._onPinClickHandler(event));
        //Config.instance.map.addEventListener('mouseover', event => this._onPinMouseOverHandler(event));
    }

    _unbindEvents() {
        Config.instance.map.elem.removeEventListener('click', event => this._onPinClickHandler(event) );
        Config.instance.map.elem.removeEventListener('mouseover', event => this._onPinMouseOverHandler(event) );
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

        if ( id ) {
            let pin = this._findMarker( id );
            Config.instance.pinStrategies[ pin.type ].onPinClick( pin );
        }

        //console.log( pin );

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
        //Config.instance.pinStrategies[ pin.pinType ].
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

    _getMarkers() {
        return [
            { id: '1', type: PinNames.hotel, title: 'HOTEL1', summary: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, non.'},
            { id: '2', type: PinNames.poi, title: 'POI1', summary: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
            { id: '3', type: PinNames.destination, holidayType: 'beachHoliday', title: 'Majorca', summary: 'Lorem ipsum dolor sit amet.'},
            { id: '4', type: PinNames.destination, holidayType: 'beachHoliday', title: 'Minorca'},
            { id: '5', type: PinNames.destination, holidayType: 'beachHoliday', title: 'Ibiza'},
            { id: '6', type: PinNames.destination, holidayType: 'cityBreak', title: 'Chelyabinsk' },
            { id: '6', type: PinNames.destination, holidayType: 'villas', title: 'Balerics' },
            { id: '7', type: PinNames.poi, title: 'POI2', summary: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, non.'},
            { id: '8', type: PinNames.airport, title: 'AIRPORT1'},
            { id: '9', type: PinNames.airport, title: 'AIRPORT2'},
            { id: '10', type: PinNames.airport, title: 'AIRPORT3'},
            { id: '11', type: PinNames.hotel, title: 'HOTEL2', summary: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, non.'},
            { id: '12', type: PinNames.hotel, title: 'HOTEL3', summary: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, non.'},
            { id: '13', type: PinNames.hotel, title: 'HOTEL4'},
            { id: '14', type: PinNames.hotel, title: 'HOTEL5'},
            { id: '15', type: PinNames.childDestination, holidayType: 'beachHoliday', title: 'child dest beach' },
            { id: '16', type: PinNames.childDestination, holidayType: 'cityBreak', title: 'child dest city' },
            { id: '17', type: PinNames.childDestination, holidayType: 'villas', title: 'child dest villas' },
        ];
    }
}



