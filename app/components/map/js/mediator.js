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
                Config.instance.currentTab = Config.instance.tabStrategies[ TabNames.overview ];
                Config.instance.currentTab.updatePinStrategies();

                Config.instance.map.drawAllPins();
                Config.instance.tabSelect.update();
                break;
            }
            case MediatorEvents.tabChanged: {
                let currentTabName = Config.instance.tabSelect.getCurrentTabName();
                Config.instance.currentTab = Config.instance.tabStrategies[ currentTabName ];

                Config.instance.map.drawAllPins();
                Config.instance.tabSelect.updateContent();
                break;
            }
            case MediatorEvents.airportPinClicked: {
                Config.instance.activePin = targetPin;
                break;
            }
            case MediatorEvents.destinationPinClicked: {
                let currentLevel = Config.instance.levelSelect.getCurrentLevel() + 1;
                Config.instance.levelSelect.setCurrentLevel( currentLevel );
                console.log( currentLevel );
                console.log( targetPin );
                break;
            }
            case MediatorEvents.pinClicked: {
                Config.instance.activePin = targetPin;
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

