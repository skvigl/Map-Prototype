'use strict';

import Config from './config';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';
import PinsHelper from 'pinsHelper';
import TabState from 'tabState';

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

                    Config.instance.tabStates = {};
                    for(let tabIndex in currentLevel.tabs)
                    {
                        let tabName = currentLevel.tabs[tabIndex];
                        Config.instance.tabStates[tabName] = new TabState();
                    }

                    Config.instance.tabStates[tabName].hasPins = true;

                    let content = currentTab.generateContent();
                    Config.instance.tabSelect.updateTabContent( content );
                });
                break;
            }
            case MediatorEvents.tabChanged: {
                let currentLevelId = Config.instance.currentLevel.levelId;
                let currentTabName = Config.instance.tabSelect.getCurrentTabName();
                let currentTabStrategy = Config.instance.tabStrategies[ currentTabName ];
                Config.instance.currentTab = currentTabStrategy;
                let pinType = this.getTargetPinType( Config.instance.currentTab.getPinStrategies(), currentTabName );

                let currentTabState = Config.instance.tabStates[currentTabName];


                if( currentTabState.hasPins ){
                    Config.instance.map.drawAllPins();
                    return ;
                }
                //TODO Level 3 pins loading: think about tab states for Level 3. All pint will be load on Overview request
                let getPinsRequest = Config.instance.ajaxHandler.getPins( pinType, currentLevelId );

                getPinsRequest.then((response) => {

                    if ( !response.data ) {
                        return;
                    }
                    let currentTabName = Config.instance.tabSelect.getCurrentTabName();
                    Config.instance.tabStates[currentTabName].hasPins = true;
                    console.log( response.data );
                    this._updatePins( response.data.pins );
                    Config.instance.map.drawAllPins();
                });

                if(!currentTabStrategy.hasDetails() || currentTabState.currentPage !== 0)
                    return;

                let getPinsByPageRequest = Config.instance.ajaxHandler.getPinsByPage( pinType, 0 );

                getPinsByPageRequest.then((response) => {

                    if ( !response.data ) {
                        return;
                    }

                    console.log( response.data );
                    this._updatePins( response.data.pins );
                });

                let pinsDetailsCallback = function pinsCallback( getPinsResponse, getPinsByPageResponse ) {
                    console.log( getPinsResponse, getPinsByPageResponse );

                    let pinsByPage = [];
                    getPinsByPageResponse.data.pins.forEach(( pin )=>{
                        let existingPin = PinsHelper.findPin( pin.id );

                        if ( existingPin ) {
                            pinsByPage.push( existingPin );
                        }
                    });

                    let content = Config.instance.currentTab.generateContent( pinsByPage ),
                        tabSelect = Config.instance.tabSelect;

                    //tabSelect.clearTabsContent();
                    tabSelect.updateTabContent( content );

                    let currentTabName = Config.instance.tabSelect.getCurrentTabName();
                    let currentTabState = Config.instance.tabStates[currentTabName];

                    currentTabState.currentPage = getPinsByPageResponse.data.currentPage;
                    currentTabState.totalPages = getPinsByPageResponse.data.totalPages;
                    console.log(currentTabState);
                };

                Config.instance.ajaxHandler.getPinsMultithread([ getPinsRequest, getPinsByPageRequest ], pinsDetailsCallback);



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
                let activePin = eventModel.targetPin;

                Config.instance.activePin = activePin;

                let content = Config.instance.currentTab.generateDetailsCard( activePin ),
                    tabSelect = Config.instance.tabSelect;

                tabSelect.updateTabContent( content );
                //TODO back button: add to details view
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

