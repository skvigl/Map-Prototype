'use strict';

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
            tabStates: {}
        };
    }

    static get instance() {
        if ( !this._instance ) {
            this._instance = new Config();
        }
        return this._instance._config;
    }
}
