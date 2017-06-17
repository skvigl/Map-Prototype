'use strict';


import LevelNames from './enums/levelNames';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import LevelsFactory from './levelsStrategies/levelsFactory';
import TabsFactory from './tabs/tabsStrategies/tabsFactory';
import PinsFactory from './pinsStrategies/pinsFactory';
import DestMapControl from './destMapControl';
import Mediator from './mediator';
import TabsControl from './tabs/tabsControl';
import FilterAirportControl from './filters/filterAirportControl';
import FilterHolidayTypeControl from './filters/filterHolidayTypeControl';
import DataLoader from './dataLoader';
import GoogleMapControl from './gmap/googleMapControl';

export class Config {

    constructor() {
        this._config = {
            maps: {
                destMapControl: null,
                googleMapControl: null,
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
                tabsControl: null,
                currentTab: null,
                strategies: null,
                tabStates: null
            },
            pins: {
                activePin: null,
                currentLocation: {},  //TODO Refactor first level logic
                data: [],
                strategies: null
            },
            filters: {
                filterAirportControl: null,
                filterHolidayTypeControl: null,
                currentAirportId: 'default',
                currentHolidayType: HolidayTypeNames.beach
            },
            mediator: null,
            dataLoader: null
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
        config.dataLoader = new DataLoader();
        config.tabs.tabsControl = new TabsControl();
        config.filters.filterAirportControl = new FilterAirportControl();
        config.filters.filterHolidayTypeControl = new FilterHolidayTypeControl();
        config.maps.destMapControl = new DestMapControl();
        config.maps.googleMapControl = new GoogleMapControl();


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

        config.tabs.strategies = {
            [ TabNames.overview ]: TabsFactory.getTabStrategy( TabNames.overview ),
            [ TabNames.pois ]: TabsFactory.getTabStrategy( TabNames.pois ),
            [ TabNames.hotels ]: TabsFactory.getTabStrategy( TabNames.hotels ),
            [ TabNames.villas ]: TabsFactory.getTabStrategy( TabNames.villas )
        };

        config.pins.strategies = {
            [ PinNames.airport ]: PinsFactory.getPinStrategy( PinNames.airport ),
            [ PinNames.destination ]: PinsFactory.getPinStrategy( PinNames.destination ),
            [ PinNames.childDestination ]: PinsFactory.getPinStrategy( PinNames.childDestination ),
            [ PinNames.poi ]: PinsFactory.getPinStrategy( PinNames.poi ),
            [ PinNames.hotel ]: PinsFactory.getPinStrategy( PinNames.hotel )
        };

        config.tabs.tabsControl.setMediator( config.mediator );
        config.filters.filterAirportControl.setMediator( config.mediator );
        config.filters.filterHolidayTypeControl.setMediator( config.mediator );

        config.filters.currentAirportId = config.filters.filterAirportControl.getValue();
        config.filters.currentHolidayType = config.filters.filterHolidayTypeControl.getValue();


    }

    static clearFilters() {
        config.filters.currentAirportId = 'default';
        config.filters.filterAirportControl.setValue('default');
    }
}

export let config = Config.instance;
Config.init();

window.initMap = function initMap() {
    Config.instance.maps.googleMapControl.init();
    Config.instance.maps.destMapControl.initLevel();
};
