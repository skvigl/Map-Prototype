'use strict';

import { Config, config } from './config';
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
                    config.currentLocation = eventModel.targetPin;
                }

                Config.clearFilters();
                config.filters.filterAirport.updateVisibility( eventModel.level );
                config.filters.filterHolidayType.updateVisibility( eventModel.level );

                let getPinsRequest = config.ajaxHandler.getPins( eventModel.pinType, eventModel.level );

                getPinsRequest.then( function ( response ) {

                    if ( !response.data ) {
                        return;
                    }

                    config.map.removeAllPins();
                    config.tabSelect.clearTabsContent();

                    let mapOptions = response.data.mapOptions;

                    config.googleMap.setOptions({
                        center: {
                            'lat': mapOptions.lat,
                            'lng': mapOptions.lng,
                        },
                        zoom: mapOptions.zoom
                    });

                    config.currentLevel = config.levelCollections[eventModel.level];
                    config.pinsArray = response.data.pins;

                    let tabName = eventModel.tabName ? eventModel.tabName : TabNames.overview,
                        currentTab = config.tabStrategies[tabName];

                    config.currentTab = currentTab;
                    currentTab.updatePinStrategies();

                    let currentLevel = config.currentLevel,
                        tabSelect = config.tabSelect;

                    tabSelect.setTabsVisibility( currentLevel.tabs );
                    tabSelect.setActiveTab( tabName );

                    config.tabStates = {};
                    for ( let tabIndex in currentLevel.tabs ) {
                        let tabName = currentLevel.tabs[tabIndex];
                        config.tabStates[tabName] = new TabState();
                    }

                    config.tabStates[tabName].hasPins = true;

                    let content = currentTab.generateContent();
                    config.tabSelect.updateTabContent( content );
                    config.map.updateBtnBackToLevelVisibility( config.locationsHistory.length );

                    config.map.drawAllPins();
                } );
                break;
            }
            case MediatorEvents.tabChanged: {
                let currentLevelId = config.currentLevel.levelId;
                let currentTabName = config.tabSelect.getCurrentTabName();
                let currentTabStrategy = config.tabStrategies[currentTabName];
                config.currentTab = currentTabStrategy;
                let pinType = this.getTargetPinType( config.currentTab.getPinStrategies(), currentTabName );

                let currentTabState = config.tabStates[currentTabName];
                config.map.hideAllPins();

                if ( currentTabState.hasPins ) {
                    config.map.drawAllPins();
                    return;
                }

                let getPinsRequest = config.ajaxHandler.getPins( pinType, currentLevelId );

                getPinsRequest.then( ( response ) => {

                    if ( !response.data ) {
                        return;
                    }
                    let currentTabName = config.tabSelect.getCurrentTabName();
                    config.tabStates[currentTabName].hasPins = true;
                    this._updatePins( response.data.pins );

                } );

                if ( !currentTabStrategy.hasDetails() || currentTabState.currentPage !== 1 )
                    return;

                let getPinsByPageRequest = config.ajaxHandler.getPinsByPage( pinType, 1 );

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

                config.ajaxHandler.getPinsMultithread( [getPinsRequest, getPinsByPageRequest], pinsDetailsCallback.bind( this ) );
                break;
            }
            case MediatorEvents.destinationPinClicked: {
                let currentLevelId = config.currentLevel.levelId;

                config.currentLocation.levelId = currentLevelId;
                config.locationsHistory.push( config.currentLocation );
                config.currentLocation = Object.assign( {}, eventModel.targetPin );
                config.currentLocation.view = null;

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
                    tabSelect = config.tabSelect;

                config.activePin = activePin;

                if ( activePin.detailsView ) {
                    let content = config.currentTab.getDetailsCard( activePin );

                    tabSelect.updateTabContent( content );
                } else {
                    let getPinDetailsRequest = config.ajaxHandler.getPinDetails( [activePin.id], activePin.type );

                    getPinDetailsRequest.then( response => {

                        if ( !response.data ) {
                            return;
                        }

                        this._updatePins( response.data );

                        let content = config.currentTab.generateDetailsCard( activePin );

                        tabSelect.updateTabContent( content );
                    } );

                }
                break;
            }
            case MediatorEvents.hideDetails: {
                let activePin = config.activePin;

                if ( activePin ) {
                    config.pinStrategies[activePin.type].removeActiveClass( activePin );
                    activePin = null;
                }
                break;
            }

            case MediatorEvents.filterPins: {
                let activePin = config.activePin,
                    targetPin = eventModel.targetPin;

                if ( eventModel.airportId ) {

                    if ( activePin ) {
                        config.pinStrategies[activePin.type].removeActiveClass( activePin );
                        activePin = null;
                    }

                    if ( !eventModel.targetPin ) {
                        targetPin = PinsHelper.findPin( eventModel.airportId );
                    }

                    if ( targetPin ) {
                        config.activePin = targetPin;
                        config.pinStrategies[targetPin.type].addActiveClass( targetPin );
                        config.filterAirport.setValue( targetPin.id );
                    }
                }

                let filterParams = config.filters,
                    isNewParams = false;

                if ( eventModel.airportId && filterParams.currentAirportId !== eventModel.airportId ) {
                    filterParams.currentAirportId = eventModel.airportId;
                    isNewParams = true;
                }

                if ( eventModel.holidayType && filterParams.currentHolidayType !== eventModel.holidayType ) {
                    filterParams.currentHolidayType = eventModel.holidayType;
                    isNewParams = true;
                }

                if ( isNewParams ) {
                    config.map.updatePinsVisibility();
                }
                break;
            }

            case MediatorEvents.loadmorePinsDetails: {

                let currentTabName = config.tabSelect.getCurrentTabName();
                let currentTabState = config.tabStates[currentTabName];
                let pinType = this.getTargetPinType( config.currentTab.getPinStrategies(), currentTabName );

                let getPinsByPageRequest = config.ajaxHandler.getPinsByPage( pinType, currentTabState.currentPage + 1 );

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
                config.pinsArray.push( pin );
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

        let content = config.currentTab.generateContent( pinsByPage );

        config.tabSelect.updateTabContent( content );
        config.map.drawAllPins();
    }

    _updateTabState( response ) {
        let currentTabName = config.tabSelect.getCurrentTabName();
        let currentTabState = config.tabStates[currentTabName];

        currentTabState.currentPage = response.data.currentPage;
        currentTabState.totalPages = response.data.totalPages;

        config.tabSelect.setLoadmoreVisibility( currentTabState.currentPage < currentTabState.totalPages );
    }
}


