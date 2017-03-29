'use strict';

import Config from './config';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import MediatorEvents from './enums/mediatorEvents';

export default class Mediator {
    constructor() {}

    stateChanged( mediatorEvent, targetPin ) {

        switch ( mediatorEvent ) {
            case MediatorEvents.levelChanged: {
                // let currentLevelId = Config.instance.levelSelect.getCurrentLevel();
                //
                // Config.instance.currentLevel = Config.instance.levelCollections[ currentLevelId ];
                //
                // let currentTab = Config.instance.currentTab;
                // currentTab = Config.instance.tabStrategies[ TabNames.overview ];
                // currentTab.updatePinStrategies();
                //
                // Config.instance.map.drawAllPins();
                //
                // let currentLevel = Config.instance.currentLevel,
                //     tabSelect = Config.instance.tabSelect;
                // tabSelect.setTabsVisibility( currentLevel.tabs );
                // tabSelect.setActiveTab( currentLevel.tabs[0] );
                // tabSelect.clearTabsContent();
                //
                // let content = Config.instance.currentTab.generateContent();
                // Config.instance.tabSelect.updateTabContent( content );

                break;
            }
            case MediatorEvents.tabChanged: {
                let currentTabName = Config.instance.tabSelect.getCurrentTabName();
                Config.instance.currentTab = Config.instance.tabStrategies[ currentTabName ];
                Config.instance.map.drawAllPins();

                let content = Config.instance.currentTab.generateContent();
                Config.instance.tabSelect.updateTabContent( content );
                break;
            }
            case MediatorEvents.airportPinClicked: {
                Config.instance.activePin = targetPin;
                break;
            }
            case MediatorEvents.destinationPinClicked: {
                let currentLevelId = Config.instance.currentLevel.levelId;

                Config.instance.currentLocation = Object.assign( {}, targetPin );
                Config.instance.currentLocation.view = null;

                if ( targetPin.holidayType === HolidayTypeNames.city ) {
                    currentLevelId = 3;
                } else {
                    currentLevelId++;
                }

                Config.instance.currentLevel = Config.instance.levelCollections[ currentLevelId ];

                let currentTab = Config.instance.currentTab;
                currentTab = Config.instance.tabStrategies[ TabNames.overview ];
                currentTab.updatePinStrategies();

                Config.instance.map.drawAllPins();

                let currentLevel = Config.instance.currentLevel,
                    tabSelect = Config.instance.tabSelect;
                tabSelect.setTabsVisibility( currentLevel.tabs );
                tabSelect.setActiveTab( currentLevel.tabs[0] );
                tabSelect.clearTabsContent();

                let content = Config.instance.currentTab.generateContent();
                Config.instance.tabSelect.updateTabContent( content );
                break;
            }
            case MediatorEvents.pinClicked: {
                Config.instance.activePin = targetPin;

                if ( Config.instance.activePin.detailsView ) {
                    Config.instance.tabSelect
                }

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

