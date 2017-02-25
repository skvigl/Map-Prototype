'use strict';

import Config from './config';
import TabNames from './enums/tabNames';

export default class Mediator {
    constructor() {
        this._initiators = {};
    }

    stateChanged( initiator ) {
        switch ( initiator ) {
            case this._initiators.levelSelect: {
                Config.instance.currentLevel = Config.instance.levelCollections[ initiator.getCurrentLevel() ];
                Config.instance.currentTab = Config.instance.currentLevel.tabs[ TabNames.overview ];
                this._initiators.tabSelect.update();
                this._initiators.map.drawAllPins();
            }
                break;
            case this._initiators.tabSelect: {
                Config.instance.currentTab = Config.instance.currentLevel.tabs[ initiator.getCurrentTab() ];
                this._initiators.map.drawAllPins();
            }
                break;
        }
    }

    addInitiator( initiatorName, initiatorObj ) {
        this._initiators[ initiatorName ] = initiatorObj;
    }
}

