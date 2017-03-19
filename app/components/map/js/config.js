'use strict';

export default class Config {

    constructor() {
        this._config = {
            map: null,
            currentLevel: {},
            currentTab: {},
            currentHolidayType: '',
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
            levelSelect: {},
            tabSelect: {},
            mediator: {},
            pinStrategies: {},
            tabStrategies: {}
        };
    }

    static get instance() {
        if ( !this._instance ) {
            this._instance = new Config();
        }
        return this._instance._config;
    }
}
