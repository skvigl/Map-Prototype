'use strict';

import Config from './config';
import TabNames from './enums/tabNames';
import MediatorEvents from './enums/mediatorEvents';

export default class Mediator {
    constructor() {
        //this._initiators = {};
    }

    stateChanged( mediatorEvent, targetPin ) {

        switch ( mediatorEvent ) {
            case MediatorEvents.levelChanged: {
                let currentLevelId = Config.instance.levelSelect.getCurrentLevel();
                Config.instance.currentLevel = Config.instance.levelCollections[ currentLevelId ];
                Config.instance.currentTab = Config.instance.currentLevel.tabs[ TabNames.overview ];

                Config.instance.map.drawAllPins();
                Config.instance.tabSelect.update();
                break;
            }
            case MediatorEvents.tabChanged: {
                let currentTabName = Config.instance.tabSelect.getCurrentTabName();
                Config.instance.currentTab = Config.instance.currentLevel.tabs[ currentTabName ];

                Config.instance.map.drawAllPins();
                Config.instance.tabSelect.updateContent();
                break;
            }
            case MediatorEvents.destinationPinClicked: {
                let currentLevel = Config.instance.levelSelect.getCurrentLevel() + 1;
                Config.instance.levelSelect.setCurrentLevel( currentLevel );
                console.log( currentLevel );
                console.log( targetPin );
                break;
            }
            default: {
                console.log( mediatorEvent, ' hasn\'t been handled.');
            }
        }
    }

    // addInitiator( initiatorName, initiatorObj ) {
    //     this._initiators[ initiatorName ] = initiatorObj;
    // }
}

