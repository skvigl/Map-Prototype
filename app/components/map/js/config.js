'use strict';


import LevelNames from './enums/levelNames';
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
                googleMap: null,
                map: null,
                isMobile: false,
            },
            levels: {
                currentLevel: null,
                locationsHistory: [],
                strategies: null,
                order: [
                    LevelNames.world,
                    LevelNames.country,
                    LevelNames.district,
                    LevelNames.resort
                ]
            },
            tabs: {
                currentTab: null,
                tabSelect: null,
                tabStrategies: null,
                tabStates: null
            },
            pins: {
                activePin: null,
                currentLocation: {},  //TODO Refactor first level logic
                pinsArray: [],
                pinStrategies: null,
                ajaxHandler: null,
            },
            filters: {
                filterAirport: null,
                filterHolidayType: null,
                currentAirportId: 'default',
                currentHolidayType: HolidayTypeNames.beach
            },
            mediator: null
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
        config.tabs.tabSelect = new TabSelect();
        config.filters.filterAirport = new FilterAirport();
        config.filters.filterHolidayType = new FilterHolidayType();
        config.pins.ajaxHandler = new AjaxHandler();
        config.maps.googleMap = new GoogleMap();

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

        config.levels.strategies = {
            [ LevelNames.world ]: {
                id: 0
            },
            [ LevelNames.country ]: {
                id: 1
            },
            [ LevelNames.district ]: {
                id: 2
            },
            [ LevelNames.resort ]: {
                id: 3
            }
        };

        for(let levelName in config.levels.strategies) {
            let level = config.levels.strategies[levelName];

            level.strategy = LevelsFactory.getLevelStrategies( levelName );
            level.tabs = level.strategy.getTabs();
        }

        // config.levels.strategies.forEach( ( level ) => {
        //     level.strategy = LevelsFactory.getLevelStrategies( level.levelId );
        //     level.tabs = level.strategy.getTabs();
        // } );

        config.tabs.tabStrategies = {
            [ TabNames.overview ]: TabsFactory.getTabStrategy( TabNames.overview ),
            [ TabNames.pois ]: TabsFactory.getTabStrategy( TabNames.pois ),
            [ TabNames.hotels ]: TabsFactory.getTabStrategy( TabNames.hotels ),
            [ TabNames.villas ]: TabsFactory.getTabStrategy( TabNames.villas )
        };

        config.pins.pinStrategies = {
            [ PinNames.airport ]: PinsFactory.getPinStrategy( PinNames.airport ),
            [ PinNames.destination ]: PinsFactory.getPinStrategy( PinNames.destination ),
            [ PinNames.childDestination ]: PinsFactory.getPinStrategy( PinNames.childDestination ),
            [ PinNames.poi ]: PinsFactory.getPinStrategy( PinNames.poi ),
            [ PinNames.hotel ]: PinsFactory.getPinStrategy( PinNames.hotel )
        };

        config.tabs.tabSelect.setMediator( config.mediator );
        config.filters.filterAirport.setMediator( config.mediator );
        config.filters.filterHolidayType.setMediator( config.mediator );

        config.filters.currentAirportId = config.filters.filterAirport.getValue();
        config.filters.currentHolidayType = config.filters.filterHolidayType.getValue();

        config.maps.map = new DestinationsMap();
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
