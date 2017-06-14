'use strict';

//import _ from 'lodash';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import LevelsFactory from './levelsStrategies/levelsFactory';
import TabsFactory from './tabs/tabsStrategies/tabsFactory';
import PinsFactory from './pinsStrategies/pinsFactory';
import DestinationsMap from './destinationsMap';
import Mediator from './mediator';
import TabSelect from './tabs/tabSelect';
import FilterAirport from './filters/filterAirport';
import FilterHolidayType from './filters/filterHolidayType';
import AjaxHandler from './ajaxHandler';
import GoogleMap from './gmap/googleMap';

export class Config {

    constructor() {
        this._config = {
            maps: {

            },
            levels: {

            },
            tabs: {

            },
            pins: {

            },
            filters: {
                filterAirport: null,
                filterHolidayType: null,
                currentAirportId: 'default',
                currentHolidayType: HolidayTypeNames.beach
            },
            map: null,
            currentLevel: {},
            currentTab: {},
            currentLocation: {},
            locationsHistory: [],
            activePin: null,
            isMobile: false,
            pinsArray: [],
            levelCollections: [
                // 0: {
                //     id: 0
                // },
                // 1: {
                //     id: 1
                // },
                // 2: {
                //     id: 2
                // },
                // 3: {
                //     id: 3
                // }
                {
                    levelId: 0
                },
                {
                    levelId: 1
                },
                {
                    levelId: 2
                },
                {
                    levelId: 3
                }
            ],
            tabSelect: {},
            mediator: {},
            pinStrategies: {},
            tabStrategies: {},
            tabStates: {},

        };
    }

    static get instance() {
        if ( !this._instance ) {
            this._instance = new Config();
        }
        return this._instance._config;
    }

    static init() {
        config.mediator = new Mediator();
        config.tabSelect = new TabSelect();
        config.filters.filterAirport = new FilterAirport();
        config.filters.filterHolidayType = new FilterHolidayType();
        config.ajaxHandler = new AjaxHandler();
        config.googleMap = new GoogleMap();

        //console.log(TabNames);
        // _.forEach(config.levelCollections, function( value, key ) {
        //     value.strategy = LevelsFactory.getLevelStrategies( key );
        //     value.tabs = value.strategy.getTabs();
        // });
        //
        // for( let level in config.levelCollections ) {
        //     config.levelCollections[level].strategy = LevelsFactory.getLevelStrategies( level );
        //     console.log(config.levelCollections[level]);
        //     config.levelCollections[level].tabs = config.levelCollections[level].strategy.getTabs();
        // }
        //
        // console.log( config.levelCollections );
        //
        // return;

        config.levelCollections.forEach( ( level ) => {
            level.strategy = LevelsFactory.getLevelStrategies( level.levelId );
            level.tabs = level.strategy.getTabs();
        } );

        config.tabStrategies = {
            [ TabNames.overview ]: TabsFactory.getTabStrategy( TabNames.overview ),
            [ TabNames.pois ]: TabsFactory.getTabStrategy( TabNames.pois ),
            [ TabNames.hotels ]: TabsFactory.getTabStrategy( TabNames.hotels ),
            [ TabNames.villas ]: TabsFactory.getTabStrategy( TabNames.villas )
        };

        config.pinStrategies = {
            [ PinNames.airport ]: PinsFactory.getPinStrategy( PinNames.airport ),
            [ PinNames.destination ]: PinsFactory.getPinStrategy( PinNames.destination ),
            [ PinNames.childDestination ]: PinsFactory.getPinStrategy( PinNames.childDestination ),
            [ PinNames.poi ]: PinsFactory.getPinStrategy( PinNames.poi ),
            [ PinNames.hotel ]: PinsFactory.getPinStrategy( PinNames.hotel )
        };

        config.tabSelect.setMediator( config.mediator );
        config.filters.filterAirport.setMediator( config.mediator );
        config.filters.filterHolidayType.setMediator( config.mediator );

        config.filters.currentAirportId = config.filters.filterAirport.getValue();
        config.filters.currentHolidayType = config.filters.filterHolidayType.getValue();

        config.map = new DestinationsMap();
        console.log( config );
    }

    static clearFilters() {
        config.filters.currentAirportId = 'default';
        config.filters.filterAirport.setValue('default');
    }
}

export let config = Config.instance;

window.initMap = function initMap() {
    Config.init();
};
