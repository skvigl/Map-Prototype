'use strict';

import Config from './config';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';

export default class Mediator {
    constructor() {}

    stateChanged( eventModel ) {

        switch ( eventModel.eventType ) {
            case MediatorEvents.levelChanged: {

                let request = Config.instance.ajaxHandler.getPins( eventModel.pinType, eventModel.level);

                request.then(function(response){

                    if ( !response.data ) {
                        return;
                    }

                    Config.instance.currentLevel = Config.instance.levelCollections[ eventModel.level ];
                    Config.instance.pinsArray = response.data.pins;

                    let tabName = eventModel.tabName ? eventModel.tabName : TabNames.overview;

                    let currentTab = Config.instance.tabStrategies[ tabName ];
                    Config.instance.currentTab = currentTab;
                    currentTab.updatePinStrategies();

                    Config.instance.map.drawAllPins();

                    let currentLevel = Config.instance.currentLevel,
                        tabSelect = Config.instance.tabSelect;
                    tabSelect.clearTabsContent();
                    tabSelect.setTabsVisibility( currentLevel.tabs );
                    tabSelect.setActiveTab( tabName );

                    let content = currentTab.generateContent();
                    Config.instance.tabSelect.updateTabContent( content );
                });
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
                Config.instance.activePin = eventModel.targetPin;
                break;
            }
            case MediatorEvents.destinationPinClicked: {
                let currentLevelId = Config.instance.currentLevel.levelId;

                Config.instance.currentLocation = Object.assign( {}, eventModel.targetPin );
                Config.instance.currentLocation.view = null;

                if ( eventModel.targetPin.holidayType === HolidayTypeNames.city ) {
                    currentLevelId = 3;
                } else {
                    currentLevelId++;
                }


                let mediatorEvent = new MediatorEventModel();
                mediatorEvent.eventType = MediatorEvents.levelChanged;
                mediatorEvent.level = currentLevelId;
                mediatorEvent.pinType = PinNames.destination;
                this.stateChanged( mediatorEvent );

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
            case MediatorEvents.pinClicked: {
                Config.instance.activePin = eventModel.targetPin;

                if ( Config.instance.activePin.detailsView ) {
                    //Config.instance.tabSelect;
                }

                break;
            }
            default: {
                console.log( eventModel.eventType, ' hasn\'t been handled.');
            }
        }
    }

    // addInitiator( initiatorName, initiatorObj ) {
    //     this._initiators[ initiatorName ] = initiatorObj;
    // }
}

