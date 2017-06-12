'use strict';

import Config from './config';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';
import PinsHelper from 'helpers/pinsHelper';
import TabState from 'tabs/tabState';

export default class Mediator {
    constructor() {
    }

    stateChanged( eventModel ) {

        switch ( eventModel.eventType ) {
            case MediatorEvents.levelChanged: {

                if ( eventModel.targetPin ) {
                    Config.instance.currentLocation = eventModel.targetPin;
                }

                Config.clearFilters();
                Config.instance.filterAirport.updateVisibility( eventModel.level );
                Config.instance.filterHolidayType.updateVisibility( eventModel.level );

                let getPinsRequest = Config.instance.ajaxHandler.getPins( eventModel.pinType, eventModel.level );

                getPinsRequest.then( function ( response ) {

                    if ( !response.data ) {
                        return;
                    }

                    Config.instance.map.removeAllPins();
                    Config.instance.tabSelect.clearTabsContent();

                    let mapOptions = response.data.mapOptions;

                    Config.instance.googleMap.setOptions({
                        center: {
                            'lat': mapOptions.lat,
                            'lng': mapOptions.lng,
                        },
                        zoom: mapOptions.zoom
                    });

                    Config.instance.currentLevel = Config.instance.levelCollections[eventModel.level];
                    Config.instance.pinsArray = response.data.pins;

                    let tabName = eventModel.tabName ? eventModel.tabName : TabNames.overview,
                        currentTab = Config.instance.tabStrategies[tabName];

                    Config.instance.currentTab = currentTab;
                    currentTab.updatePinStrategies();

                    let currentLevel = Config.instance.currentLevel,
                        tabSelect = Config.instance.tabSelect;

                    tabSelect.setTabsVisibility( currentLevel.tabs );
                    tabSelect.setActiveTab( tabName );

                    Config.instance.tabStates = {};
                    for ( let tabIndex in currentLevel.tabs ) {
                        let tabName = currentLevel.tabs[tabIndex];
                        Config.instance.tabStates[tabName] = new TabState();
                    }

                    Config.instance.tabStates[tabName].hasPins = true;

                    let content = currentTab.generateContent();
                    Config.instance.tabSelect.updateTabContent( content );
                    Config.instance.map.updateBtnBackToLevelVisibility( Config.instance.locationsHistory.length );

                    Config.instance.map.drawAllPins();
                } );
                break;
            }
            case MediatorEvents.tabChanged: {
                let currentLevelId = Config.instance.currentLevel.levelId;
                let currentTabName = Config.instance.tabSelect.getCurrentTabName();
                let currentTabStrategy = Config.instance.tabStrategies[currentTabName];
                Config.instance.currentTab = currentTabStrategy;
                let pinType = this.getTargetPinType( Config.instance.currentTab.getPinStrategies(), currentTabName );

                let currentTabState = Config.instance.tabStates[currentTabName];
                Config.instance.map.hideAllPins();

                if ( currentTabState.hasPins ) {
                    Config.instance.map.drawAllPins();
                    return;
                }

                let getPinsRequest = Config.instance.ajaxHandler.getPins( pinType, currentLevelId );

                getPinsRequest.then( ( response ) => {

                    if ( !response.data ) {
                        return;
                    }
                    let currentTabName = Config.instance.tabSelect.getCurrentTabName();
                    Config.instance.tabStates[currentTabName].hasPins = true;
                    this._updatePins( response.data.pins );

                } );

                if ( !currentTabStrategy.hasDetails() || currentTabState.currentPage !== 1 )
                    return;

                let getPinsByPageRequest = Config.instance.ajaxHandler.getPinsByPage( pinType, 1 );

                getPinsByPageRequest.then( ( response ) => {

                    if ( !response.data ) {
                        return;
                    }

                    this._updatePins( response.data.pins );
                } );

                let pinsDetailsCallback = function pinsCallback( getPinsResponse, getPinsByPageResponse ) {
                    this._drawPinsDetails( getPinsByPageResponse );
                    this._updateTabState( getPinsByPageResponse );
                };

                Config.instance.ajaxHandler.getPinsMultithread( [getPinsRequest, getPinsByPageRequest], pinsDetailsCallback.bind( this ) );
                break;
            }
            case MediatorEvents.destinationPinClicked: {
                let currentLevelId = Config.instance.currentLevel.levelId;

                Config.instance.currentLocation.levelId = currentLevelId;
                Config.instance.locationsHistory.push( Config.instance.currentLocation );
                Config.instance.currentLocation = Object.assign( {}, eventModel.targetPin );
                Config.instance.currentLocation.view = null;

                if ( eventModel.targetPin.holidayType === HolidayTypeNames.city ) {
                    currentLevelId = 3;
                } else {
                    currentLevelId += eventModel.targetPin.type === PinNames.childDestination ? 2 : 1;
                }

                let mediatorEvent = new MediatorEventModel();
                mediatorEvent.eventType = MediatorEvents.levelChanged;
                mediatorEvent.level = currentLevelId;
                mediatorEvent.pinType = PinNames.destination;
                this.stateChanged( mediatorEvent );
                break;
            }
            case MediatorEvents.pinClicked: {
                let activePin = eventModel.targetPin,
                    tabSelect = Config.instance.tabSelect;

                Config.instance.activePin = activePin;

                if ( activePin.detailsView ) {
                    let content = Config.instance.currentTab.getDetailsCard( activePin );

                    tabSelect.updateTabContent( content );
                } else {
                    let getPinDetailsRequest = Config.instance.ajaxHandler.getPinDetails( [activePin.id], activePin.type );

                    getPinDetailsRequest.then( response => {

                        if ( !response.data ) {
                            return;
                        }

                        this._updatePins( response.data );

                        let content = Config.instance.currentTab.generateDetailsCard( activePin );

                        tabSelect.updateTabContent( content );
                    } );

                }
                break;
            }
            case MediatorEvents.hideDetails: {
                let activePin = Config.instance.activePin;

                if ( activePin ) {
                    Config.instance.pinStrategies[activePin.type].removeActiveClass( activePin );
                    activePin = null;
                }
                break;
            }

            case MediatorEvents.filterPins: {
                let activePin = Config.instance.activePin,
                    targetPin = eventModel.targetPin;

                if ( activePin ) {
                    Config.instance.pinStrategies[activePin.type].removeActiveClass( activePin );
                    activePin = null;
                }

                if ( !eventModel.targetPin ) {
                    targetPin = PinsHelper.findPin( eventModel.airportId );
                }

                if ( targetPin ) {
                    Config.instance.activePin = targetPin;
                    Config.instance.pinStrategies[targetPin.type].addActiveClass( targetPin );
                    Config.instance.filterAirport.setValue( targetPin.id );
                }

                let filterParams = Config.instance.filterParams,
                    isNewParams = false;

                if ( eventModel.airportId && filterParams.airportId !== eventModel.airportId ) {
                    filterParams.airportId = eventModel.airportId;
                    isNewParams = true;
                }

                if ( eventModel.holidayType && filterParams.holidayType !== eventModel.holidayType ) {
                    filterParams.holidayType = eventModel.holidayType;
                    isNewParams = true;
                }

                if ( isNewParams ) {
                    Config.instance.map.updatePinsVisibility();
                }
                break;
            }

            case MediatorEvents.loadmorePinsDetails: {

                let currentTabName = Config.instance.tabSelect.getCurrentTabName();
                let currentTabState = Config.instance.tabStates[currentTabName];
                let pinType = this.getTargetPinType( Config.instance.currentTab.getPinStrategies(), currentTabName );

                let getPinsByPageRequest = Config.instance.ajaxHandler.getPinsByPage( pinType, currentTabState.currentPage + 1 );

                getPinsByPageRequest.then( ( response ) => {

                    if ( !response.data ) {
                        return;
                    }

                    this._updatePins( response.data.pins );
                    this._drawPinsDetails( response );
                    this._updateTabState( response );
                } );
                break;
            }

            default: {
                console.log( eventModel.eventType, ' hasn\'t been handled.' );
            }
        }
    }

    getTargetPinType( pinTypes, tabName ) {

        if ( tabName === TabNames.overview ) {
            return PinNames.destination;
        }

        for ( let pinType in pinTypes ) {

            if ( pinTypes[pinType] !== PinNames.childDestination && pinTypes[pinType] !== PinNames.airport ) {
                return pinTypes[pinType];
            }
        }
    }

    _updatePins( pins ) {
        pins.forEach( ( pin ) => {
            let targetPin = PinsHelper.findPin( pin.id );

            if ( targetPin ) {
                PinsHelper.mergePin( targetPin, pin );
            } else {
                Config.instance.pinsArray.push( pin );
            }
        } );
    }

    _drawPinsDetails( response ) {
        let pinsByPage = [];

        response.data.pins.forEach( ( pin ) => {
            let existingPin = PinsHelper.findPin( pin.id );

            if ( existingPin ) {
                pinsByPage.push( existingPin );
            }
        } );

        let content = Config.instance.currentTab.generateContent( pinsByPage );

        Config.instance.tabSelect.updateTabContent( content );
        Config.instance.map.drawAllPins();
    }

    _updateTabState( response ) {
        let currentTabName = Config.instance.tabSelect.getCurrentTabName();
        let currentTabState = Config.instance.tabStates[currentTabName];

        currentTabState.currentPage = response.data.currentPage;
        currentTabState.totalPages = response.data.totalPages;

        Config.instance.tabSelect.setLoadmoreVisibility( currentTabState.currentPage < currentTabState.totalPages );
    }
}


