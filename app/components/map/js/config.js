'use strict';

import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import LevelsFactory from './levelsStrategies/levelsFactory';
import TabsFactory from './tabs/tabsStrategies/tabsFactory';
import PinsFactory from './pinsStrategies/pinsFactory';
import Map from './map';
import Mediator from './mediator';
import TabSelect from './tabs/tabSelect';
import FilterAirport from './filters/filterAirport';
import FilterHolidayType from './filters/filterHolidayType';
import AjaxHandler from './ajaxHandler';

export default class Config {

    constructor() {
        this._config = {
            map: null,
            currentLevel: {},
            currentTab: {},
            currentHolidayType: '',
            currentLocation: {},
            locationsHistory: [],
            activePin: null,
            isMobile: false,
            pinsArray: [],
            levelCollections: [
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
            filterParams: {
                airportId: 'default',
                holidayType: HolidayTypeNames.beach
            }
        };
    }

    static get instance() {
        if ( !this._instance ) {
            this._instance = new Config();
            this._instance.init();
        }
        return this._instance._config;
    }

    init() {
        Config.instance.mediator = new Mediator();
        Config.instance.tabSelect = new TabSelect();
        Config.instance.filterAirport = new FilterAirport();
        Config.instance.filterHolidayType = new FilterHolidayType();
        Config.instance.ajaxHandler = new AjaxHandler();

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

        Config.instance.tabSelect.setMediator( Config.instance.mediator );
        Config.instance.filterAirport.setMediator( Config.instance.mediator );
        Config.instance.filterHolidayType.setMediator( Config.instance.mediator );

        Config.instance.filterParams = {
            airportId: Config.instance.filterAirport.getValue(),
            holidayType: Config.instance.filterHolidayType.getValue()
        };

        Config.instance.map = new Map();

        console.log( Config.instance );
    }

    static clearFilters() {
        Config.instance.filterParams.airportId = 'default';
        Config.instance.filterAirport.setValue('default');
    }
}
