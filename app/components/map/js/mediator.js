'use strict';

import {Config, config} from './config';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';
import PinsHelper from './helpers/pinsHelper';
import TabState from './tabs/tabState';

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
                config.maps.destMapControl.updateFiltersVisibility( eventModel.levelName );
                config.maps.destMapControl.updateBtnBackToLevelVisibility( config.levels.locationsHistory.length );

                let getPinsRequest = config.dataLoader.getPins(
                    eventModel.pinType,
                    config.levels.strategies[eventModel.levelName].id
                );

                getPinsRequest.then( function ( response ) {

                    if ( !response.data ) {
                        return;
                    }

                    config.maps.destMapControl.removeAllPins();
                    config.tabs.tabsControl.clearTabsContent();

                    let mapOptions = response.data.mapOptions;

                    config.maps.googleMapControl.setOptions( {
                        center: {
                            'lat': mapOptions.lat,
                            'lng': mapOptions.lng,
                        },
                        zoom: mapOptions.zoom
                    } );

                    config.levels.currentLevel = config.levels.strategies[eventModel.levelName];
                    config.pins.data = response.data.pins;

                    let tabName = eventModel.tabName ? eventModel.tabName : TabNames.overview,
                        currentTab = config.tabs.strategies[tabName];

                    config.tabs.currentTab = currentTab;
                    currentTab.updatePinStrategies();

                    let currentLevel = config.levels.currentLevel,
                        tabsControl = config.tabs.tabsControl;

                    tabsControl.setTabsVisibility( currentLevel.tabs );
                    tabsControl.setActiveTab( tabName );

                    config.tabs.tabStates = {};
                    for ( let tabIndex in currentLevel.tabs ) {
                        let tabName = currentLevel.tabs[tabIndex];
                        config.tabs.tabStates[tabName] = new TabState();
                    }

                    config.tabs.tabStates[tabName].hasPins = true;

                    let content = currentTab.generateContent();
                    config.tabs.tabsControl.updateTabContent( content );


                    config.maps.destMapControl.drawAllPins();
                } );

                break;
            }
            case MediatorEvents.tabChanged: {
                let currentLevelId = config.levels.currentLevel.id;
                let currentTabName = config.tabs.tabsControl.getCurrentTabName();
                let currentTabStrategy = config.tabs.strategies[currentTabName];
                config.tabs.currentTab = currentTabStrategy;
                let pinType = this._getTargetPinType( config.tabs.currentTab.getPinStrategies(), currentTabName );

                let currentTabState = config.tabs.tabStates[currentTabName];
                config.maps.destMapControl.hideAllPins();

                if ( currentTabState.hasPins ) {
                    config.maps.destMapControl.drawAllPins();
                    return;
                }

                let getPinsRequest = config.dataLoader.getPins( pinType, currentLevelId );

                getPinsRequest.then( ( response ) => {

                    if ( !response.data ) {
                        return;
                    }
                    let currentTabName = config.tabs.tabsControl.getCurrentTabName();
                    config.tabs.tabStates[currentTabName].hasPins = true;
                    this._updatePins( response.data.pins );

                } );

                if ( !currentTabStrategy.hasDetails() || currentTabState.currentPage !== 1 )
                    return;

                let getPinsByPageRequest = config.dataLoader.getPinsByPage( pinType, 1 );

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

                config.dataLoader.getPinsMultithread( [getPinsRequest, getPinsByPageRequest], pinsDetailsCallback.bind( this ) );
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
                    tabsControl = config.tabs.tabsControl;

                config.pins.activePin = activePin;

                if ( activePin.detailsView ) {
                    let content = config.tabs.currentTab.getDetailsCard( activePin );

                    tabsControl.updateTabContent( content );
                } else {
                    let getPinDetailsRequest = config.dataLoader.getPinDetails( [activePin.id], activePin.type );

                    getPinDetailsRequest.then( response => {

                        if ( !response.data ) {
                            return;
                        }

                        this._updatePins( response.data );

                        let content = config.tabs.currentTab.generateDetailsCard( activePin );

                        tabsControl.updateTabContent( content );
                    } );

                }
                break;
            }
            case MediatorEvents.hideDetails: {
                let activePin = config.pins.activePin;

                if ( activePin ) {
                    config.pins.strategies[activePin.type].removeActiveClass( activePin );
                    activePin = null;
                }
                break;
            }

            case MediatorEvents.filterPins: {
                let activePin = config.pins.activePin,
                    targetPin = eventModel.targetPin;

                if ( eventModel.airportId ) {

                    if ( activePin ) {
                        config.pins.strategies[activePin.type].removeActiveClass( activePin );
                        activePin = null;
                    }

                    if ( !eventModel.targetPin ) {
                        targetPin = PinsHelper.findPin( eventModel.airportId );
                    }

                    if ( targetPin ) {
                        config.pins.activePin = targetPin;
                        config.pins.strategies[targetPin.type].addActiveClass( targetPin );
                        config.filters.filterAirportControl.setValue( targetPin.id );
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
                    config.maps.destMapControl.updatePinsVisibility();
                }
                break;
            }

            case MediatorEvents.loadmorePinsDetails: {

                let currentTabName = config.tabs.tabsControl.getCurrentTabName();
                let currentTabState = config.tabs.tabStates[currentTabName];
                let pinType = this._getTargetPinType( config.tabs.currentTab.getPinStrategies(), currentTabName );

                let getPinsByPageRequest = config.dataLoader.getPinsByPage( pinType, currentTabState.currentPage + 1 );

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

    _getTargetPinType( pinTypes, tabName ) {

        if ( tabName === TabNames.overview ) {
            return PinNames.destination;
        }

        for ( let pinType in pinTypes ) {

            if ( !pinTypes.hasOwnProperty( pinType ) ) {
                continue;
            }

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
                config.pins.data.push( pin );
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

        config.tabs.tabsControl.updateTabContent( content );
        config.maps.destMapControl.drawAllPins();
    }

    _updateTabState( response ) {
        let currentTabName = config.tabs.tabsControl.getCurrentTabName();
        let currentTabState = config.tabs.tabStates[currentTabName];

        currentTabState.currentPage = response.data.currentPage;
        currentTabState.totalPages = response.data.totalPages;

        config.tabs.tabsControl.setLoadmoreVisibility( currentTabState.currentPage < currentTabState.totalPages );
    }
}


