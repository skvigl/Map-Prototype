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
                    config.pins.currentLocation = eventModel.targetPin;
                }

                Config.clearFilters();
                config.filters.filterAirport.updateVisibility( eventModel.levelName );
                config.filters.filterHolidayType.updateVisibility( eventModel.levelName );

                let getPinsRequest = config.pins.ajaxHandler.getPins(
                    eventModel.pinType,
                    config.levels.strategies[eventModel.levelName].id
                );

                getPinsRequest.then( function ( response ) {

                    if ( !response.data ) {
                        return;
                    }

                    config.maps.map.removeAllPins();
                    config.tabs.tabSelect.clearTabsContent();

                    let mapOptions = response.data.mapOptions;

                    config.maps.googleMap.setOptions({
                        center: {
                            'lat': mapOptions.lat,
                            'lng': mapOptions.lng,
                        },
                        zoom: mapOptions.zoom
                    });

                    config.levels.currentLevel = config.levels.strategies[ eventModel.levelName ];
                    config.pins.pinsArray = response.data.pins;

                    let tabName = eventModel.tabName ? eventModel.tabName : TabNames.overview,
                        currentTab = config.tabs.tabStrategies[tabName];

                    config.tabs.currentTab = currentTab;
                    currentTab.updatePinStrategies();

                    let currentLevel = config.levels.currentLevel,
                        tabSelect = config.tabs.tabSelect;

                    tabSelect.setTabsVisibility( currentLevel.tabs );
                    tabSelect.setActiveTab( tabName );

                    config.tabs.tabStates = {};
                    for ( let tabIndex in currentLevel.tabs ) {
                        let tabName = currentLevel.tabs[tabIndex];
                        config.tabs.tabStates[tabName] = new TabState();
                    }

                    config.tabs.tabStates[tabName].hasPins = true;

                    let content = currentTab.generateContent();
                    config.tabs.tabSelect.updateTabContent( content );
                    config.maps.map.updateBtnBackToLevelVisibility( config.levels.locationsHistory.length );

                    config.maps.map.drawAllPins();
                } );
                console.log( config );
                break;
            }
            case MediatorEvents.tabChanged: {
                let currentLevelId = config.levels.currentLevel.id;
                let currentTabName = config.tabs.tabSelect.getCurrentTabName();
                let currentTabStrategy = config.tabs.tabStrategies[currentTabName];
                config.tabs.currentTab = currentTabStrategy;
                let pinType = this.getTargetPinType( config.tabs.currentTab.getPinStrategies(), currentTabName );

                let currentTabState = config.tabs.tabStates[currentTabName];
                config.maps.map.hideAllPins();

                if ( currentTabState.hasPins ) {
                    config.maps.map.drawAllPins();
                    return;
                }

                let getPinsRequest = config.pins.ajaxHandler.getPins( pinType, currentLevelId );

                getPinsRequest.then( ( response ) => {

                    if ( !response.data ) {
                        return;
                    }
                    let currentTabName = config.tabs.tabSelect.getCurrentTabName();
                    config.tabs.tabStates[currentTabName].hasPins = true;
                    this._updatePins( response.data.pins );

                } );

                if ( !currentTabStrategy.hasDetails() || currentTabState.currentPage !== 1 )
                    return;

                let getPinsByPageRequest = config.pins.ajaxHandler.getPinsByPage( pinType, 1 );

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

                config.pins.ajaxHandler.getPinsMultithread( [getPinsRequest, getPinsByPageRequest], pinsDetailsCallback.bind( this ) );
                break;
            }
            case MediatorEvents.destinationPinClicked: {
                let currentLevelId = config.levels.currentLevel.id;

                config.pins.currentLocation.id = currentLevelId;
                config.levels.locationsHistory.push( config.pins.currentLocation );
                config.pins.currentLocation = Object.assign( {}, eventModel.targetPin );
                config.pins.currentLocation.view = null;

                if ( eventModel.targetPin.holidayType === HolidayTypeNames.city ) {
                    currentLevelId = 3;
                } else {
                    currentLevelId += eventModel.targetPin.type === PinNames.childDestination ? 2 : 1;
                }

                let mediatorEvent = new MediatorEventModel();
                mediatorEvent.eventType = MediatorEvents.levelChanged;
                mediatorEvent.levelName = config.levels.order[currentLevelId];
                mediatorEvent.pinType = PinNames.destination;
                this.stateChanged( mediatorEvent );
                break;
            }
            case MediatorEvents.pinClicked: {
                let activePin = eventModel.targetPin,
                    tabSelect = config.tabs.tabSelect;

                config.pins.activePin = activePin;

                if ( activePin.detailsView ) {
                    let content = config.tabs.currentTab.getDetailsCard( activePin );

                    tabSelect.updateTabContent( content );
                } else {
                    let getPinDetailsRequest = config.pins.ajaxHandler.getPinDetails( [activePin.id], activePin.type );

                    getPinDetailsRequest.then( response => {

                        if ( !response.data ) {
                            return;
                        }

                        this._updatePins( response.data );

                        let content = config.tabs.currentTab.generateDetailsCard( activePin );

                        tabSelect.updateTabContent( content );
                    } );

                }
                break;
            }
            case MediatorEvents.hideDetails: {
                let activePin = config.pins.activePin;

                if ( activePin ) {
                    config.pins.pinStrategies[activePin.type].removeActiveClass( activePin );
                    activePin = null;
                }
                break;
            }

            case MediatorEvents.filterPins: {
                let activePin = config.pins.activePin,
                    targetPin = eventModel.targetPin;

                if ( eventModel.airportId ) {

                    if ( activePin ) {
                        config.pins.pinStrategies[activePin.type].removeActiveClass( activePin );
                        activePin = null;
                    }

                    if ( !eventModel.targetPin ) {
                        targetPin = PinsHelper.findPin( eventModel.airportId );
                    }

                    if ( targetPin ) {
                        config.pins.activePin = targetPin;
                        config.pins.pinStrategies[targetPin.type].addActiveClass( targetPin );
                        config.filters.filterAirport.setValue( targetPin.id );
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
                    config.maps.map.updatePinsVisibility();
                }
                break;
            }

            case MediatorEvents.loadmorePinsDetails: {

                let currentTabName = config.tabs.tabSelect.getCurrentTabName();
                let currentTabState = config.tabs.tabStates[currentTabName];
                let pinType = this.getTargetPinType( config.tabs.currentTab.getPinStrategies(), currentTabName );

                let getPinsByPageRequest = config.pins.ajaxHandler.getPinsByPage( pinType, currentTabState.currentPage + 1 );

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
                config.pins.pinsArray.push( pin );
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

        let content = config.tabs.currentTab.generateContent( pinsByPage );

        config.tabs.tabSelect.updateTabContent( content );
        config.maps.map.drawAllPins();
    }

    _updateTabState( response ) {
        let currentTabName = config.tabs.tabSelect.getCurrentTabName();
        let currentTabState = config.tabs.tabStates[currentTabName];

        currentTabState.currentPage = response.data.currentPage;
        currentTabState.totalPages = response.data.totalPages;

        config.tabs.tabSelect.setLoadmoreVisibility( currentTabState.currentPage < currentTabState.totalPages );
    }
}


