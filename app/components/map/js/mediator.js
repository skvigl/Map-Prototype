'use strict';

import Config from './config';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';
import PinsHelper from 'pinsHelper';

export default class Mediator {
    constructor() {}

    stateChanged( eventModel ) {

        switch ( eventModel.eventType ) {
            case MediatorEvents.levelChanged: {

                let getPinsRequest = Config.instance.ajaxHandler.getPins( eventModel.pinType, eventModel.level );

                getPinsRequest.then(function(response){

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
                let currentLevelId = Config.instance.currentLevel.levelId;
                let currentTabName = Config.instance.tabSelect.getCurrentTabName();
                Config.instance.currentTab = Config.instance.tabStrategies[ currentTabName ];
                let pinType = this.getTargetPinType( Config.instance.currentTab.getPinStrategies(), currentTabName );

                let getPinsRequest = Config.instance.ajaxHandler.getPins( pinType, currentLevelId );

                getPinsRequest.then((response) => {

                    if ( !response.data ) {
                        return;
                    }

                    console.log( response.data );
                    this._updatePins( response.data.pins );
                });

                let getPinsByPageRequest = Config.instance.ajaxHandler.getPinsByPage( pinType, 0 );

                getPinsByPageRequest.then((response) => {

                    if ( !response.data ) {
                        return;
                    }

                    console.log( response.data );
                    this._updatePins( response.data.pins );
                });

                let pinsCallback = function pinsCallback( getPinsResponse, getPinsByPageResponse ) {
                    console.log( getPinsResponse, getPinsByPageResponse );
                    Config.instance.map.drawAllPins();

                    let pinsByPage = [];
                    getPinsByPageResponse.data.pins.forEach(( pin )=>{
                        let existingPin = PinsHelper.findPin( pin.id );

                        if ( existingPin ) {
                            pinsByPage.push( existingPin );
                        }
                    });

                    let content = Config.instance.currentTab.generateContent( pinsByPage ),
                        tabSelect = Config.instance.tabSelect;

                    tabSelect.clearTabsContent();
                    tabSelect.updateTabContent( content );
                };

                Config.instance.ajaxHandler.getPinsMultithread([ getPinsRequest, getPinsByPageRequest ], pinsCallback);

                // multithreadRequest.then(() => {
                //     Config.instance.map.drawAllPins();
                //
                //     let content = Config.instance.currentTab.generateContent(),
                //         tabSelect = Config.instance.tabSelect;
                //
                //     tabSelect.clearTabsContent();
                //     tabSelect.updateTabContent( content );
                // });
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

    getTargetPinType( pinTypes, tabName ) {

        if ( tabName === TabNames.overview ) {
            return PinNames.destination;
        }

        for( let pinType in pinTypes ) {

            if( pinTypes[pinType] !== PinNames.childDestination && pinTypes[pinType] !== PinNames.airport ) {
                return pinTypes[pinType];
            }
        }
    }

    _updatePins( pins ) {
        pins.forEach(( pin )=>{
            let targetPin = PinsHelper.findPin( pin.id );

            if ( targetPin ) {
                PinsHelper.mergePin( targetPin, pin );
            } else {
                Config.instance.pinsArray.push( pin );
            }
        });
    }

    // addInitiator( initiatorName, initiatorObj ) {
    //     this._initiators[ initiatorName ] = initiatorObj;
    // }
}

