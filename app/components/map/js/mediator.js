import { Config, config } from './config';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import HolidayTypeNames from './enums/holidayTypeNames';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';
import PinsHelper from './helpers/pinsHelper';
import TabState from './tabs/tabState';

export default class Mediator {
    stateChanged( eventModel ) {
        switch ( eventModel.eventType ) {
            case MediatorEvents.levelChanged: {
                if ( eventModel.targetPin ) {
                    config.pins.currentLocation = eventModel.targetPin;
                }

                Config.clearFilters();
                config.maps.destMapControl.updateFiltersVisibility( eventModel.levelName );
                config.maps.destMapControl.updateBtnBackToLevelVisibility(
                    config.levels.locationsHistory.length
                );

                const getPinsRequest = config.dataLoader.getPins(
                    eventModel.pinType,
                    eventModel.levelName
                );

                getPinsRequest.then( ( response ) => {
                    if ( !response.data ) return;

                    config.maps.destMapControl.removeAllPins();
                    config.tabs.tabsControl.clearTabsContent();

                    const mapOptions = response.data.mapOptions;

                    config.maps.googleMapControl.setOptions( {
                        center: {
                            lat: mapOptions.lat,
                            lng: mapOptions.lng,
                        },
                        zoom: mapOptions.zoom
                    } );

                    config.levels.currentLevel = config.levels.strategies[eventModel.levelName];
                    config.pins.data = response.data.pins;

                    const tabName = eventModel.tabName ? eventModel.tabName : TabNames.overview,
                        currentTab = config.tabs.strategies[tabName];

                    config.tabs.currentTab = currentTab;
                    currentTab.updatePinStrategies();

                    const currentLevel = config.levels.currentLevel,
                        tabsControl = config.tabs.tabsControl;

                    tabsControl.setTabsVisibility( currentLevel.tabs );
                    tabsControl.setActiveTab( tabName );

                    config.tabs.tabStates = {};

                    currentLevel.tabs.forEach( ( tabName ) => {
                        config.tabs.tabStates[tabName] = new TabState();
                    } );

                    config.tabs.tabStates[tabName].hasPins = true;

                    const content = currentTab.generateContent();
                    config.tabs.tabsControl.updateTabContent( content );

                    config.maps.destMapControl.drawAllPins();
                    config.maps.destMapControl.removeLoadingClass();
                } );

                break;
            }
            case MediatorEvents.tabChanged: {
                const currentLevelName = config.levels.currentLevel.name,
                    currentTabName = config.tabs.tabsControl.getCurrentTabName(),
                    currentTabStrategy = config.tabs.strategies[currentTabName];

                config.tabs.currentTab = currentTabStrategy;
                const pinType = this._getTargetPinType(
                    config.tabs.currentTab.getPinStrategies(),
                    currentTabName
                );

                const currentTabState = config.tabs.tabStates[currentTabName];
                config.maps.destMapControl.hideAllPins();

                if ( currentTabState.hasPins ) {
                    config.maps.destMapControl.drawAllPins();
                    return;
                }

                config.maps.destMapControl.addLoadingClass();

                const getPinsRequest = config.dataLoader.getPins( pinType, currentLevelName );

                getPinsRequest.then( ( response ) => {
                    if ( !response.data ) {
                        return;
                    }

                    const currentTabName = config.tabs.tabsControl.getCurrentTabName();
                    config.tabs.tabStates[currentTabName].hasPins = true;
                    this._updatePins( response.data.pins );
                } );

                if ( !currentTabStrategy.hasDetails() || currentTabState.currentPage !== 1 ) return;

                const getPinsByPageRequest = config.dataLoader.getPinsByPage( pinType, 1 );

                getPinsByPageRequest.then( ( response ) => {
                    if ( !response.data ) {
                        return;
                    }

                    this._updatePins( response.data.pins );
                } );

                const pinsDetailsCallback = function pinsCallback( getPinsResponse, getPinsByPageResponse ) {
                    this._drawPinsDetails( getPinsByPageResponse );
                    this._updateTabState( getPinsByPageResponse );
                    config.maps.destMapControl.removeLoadingClass();
                };

                config.dataLoader.getPinsMultithread(
                    [getPinsRequest, getPinsByPageRequest],
                    pinsDetailsCallback.bind( this )
                );
                break;
            }
            case MediatorEvents.destinationPinClicked: {
                const currentLevel = config.levels.currentLevel;
                let currentLevelOrder = config.levels.order.indexOf( currentLevel.name );

                config.maps.destMapControl.addLoadingClass();

                if ( !config.pins.currentLocation ) {
                    config.pins.currentLocation = {};
                }

                config.pins.currentLocation.levelName = currentLevel.name;
                config.levels.locationsHistory.push( config.pins.currentLocation );
                config.pins.currentLocation = Object.assign( {}, eventModel.targetPin );
                config.pins.currentLocation = Object.assign( {}, eventModel.targetPin );
                config.pins.currentLocation.view = null;

                if ( eventModel.targetPin.holidayType === HolidayTypeNames.city ) {
                    currentLevelOrder = 3;
                } else {
                    currentLevelOrder += eventModel.targetPin.type === PinNames.childDestination ? 2 : 1;
                }

                const mediatorEvent = new MediatorEventModel();
                mediatorEvent.eventType = MediatorEvents.levelChanged;
                mediatorEvent.levelName = config.levels.order[currentLevelOrder];
                mediatorEvent.pinType = PinNames.destination;
                this.stateChanged( mediatorEvent );
                break;
            }
            case MediatorEvents.pinClicked: {
                const activePin = eventModel.targetPin,
                    tabsControl = config.tabs.tabsControl;

                config.pins.activePin = activePin;

                if ( activePin.detailsView ) {
                    const content = config.tabs.currentTab.getDetailsCard( activePin );

                    tabsControl.updateTabContent( content );
                } else {
                    config.maps.destMapControl.addLoadingClass();

                    const getPinDetailsRequest = config.dataLoader.getPinDetails(
                        [activePin.id],
                        activePin.type
                    );

                    getPinDetailsRequest.then( ( response ) => {
                        if ( !response.data ) return;

                        this._updatePins( response.data );

                        const content = config.tabs.currentTab.generateDetailsCard( activePin );

                        tabsControl.updateTabContent( content );
                        config.maps.destMapControl.removeLoadingClass();
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

                const filterParams = config.filters;
                let isNewParams = false;

                if ( eventModel.airportId &&
                    filterParams.currentAirportId !== eventModel.airportId ) {
                    filterParams.currentAirportId = eventModel.airportId;
                    isNewParams = true;
                }

                if ( eventModel.holidayType &&
                    filterParams.currentHolidayType !== eventModel.holidayType ) {
                    filterParams.currentHolidayType = eventModel.holidayType;
                    isNewParams = true;
                }

                if ( isNewParams ) {
                    config.maps.destMapControl.updatePinsVisibility();
                }
                break;
            }

            case MediatorEvents.loadmorePinsDetails: {
                const currentTabName = config.tabs.tabsControl.getCurrentTabName(),
                    currentTabState = config.tabs.tabStates[currentTabName],
                    pinType = this._getTargetPinType(
                        config.tabs.currentTab.getPinStrategies(),
                        currentTabName );

                config.maps.destMapControl.addLoadingClass();

                const getPinsByPageRequest = config.dataLoader.getPinsByPage( pinType, currentTabState.currentPage + 1 );

                getPinsByPageRequest.then( ( response ) => {
                    if ( !response.data ) return;

                    this._updatePins( response.data.pins );
                    this._drawPinsDetails( response );
                    this._updateTabState( response );
                    config.maps.destMapControl.removeLoadingClass();
                } );
                break;
            }

            default: {
                console.log( eventModel.eventType, ' hasn\'t been handled.' );
            }
        }
    }

    _getTargetPinType( pinTypes, tabName ) {
        if ( tabName === TabNames.overview ) return PinNames.destination;

        const filteredPinTypes = [];

        // console.log( pinTypes);

        // for ( let pinType in pinTypes ) {
        //     if ( !pinTypes.hasOwnProperty( pinType ) ) {
        //         continue;
        //     }
        //
        //     if ( pinTypes[pinType] !== PinNames.childDestination && pinTypes[pinType] !== PinNames.airport ) {
        //         return pinTypes[pinType];
        //     }
        // }

        // chto blyat zdes proishodit??

        pinTypes.forEach( ( pinType ) => {
            if ( pinType !== PinNames.childDestination &&
                pinType !== PinNames.airport ) {
                filteredPinTypes.push( pinType );
            }
        } );

        return filteredPinTypes;
    }

    _updatePins( pins ) {
        pins.forEach( ( pin ) => {
            const targetPin = PinsHelper.findPin( pin.id );

            if ( targetPin ) {
                PinsHelper.mergePin( targetPin, pin );
            } else {
                config.pins.data.push( pin );
            }
        } );
    }

    _drawPinsDetails( response ) {
        const pinsByPage = [];

        response.data.pins.forEach( ( pin ) => {
            const existingPin = PinsHelper.findPin( pin.id );

            if ( existingPin ) {
                pinsByPage.push( existingPin );
            }
        } );

        const content = config.tabs.currentTab.generateContent( pinsByPage );

        config.tabs.tabsControl.updateTabContent( content );
        config.maps.destMapControl.drawAllPins();
    }

    _updateTabState( response ) {
        const currentTabName = config.tabs.tabsControl.getCurrentTabName(),
            currentTabState = config.tabs.tabStates[currentTabName];

        currentTabState.currentPage = response.data.currentPage;
        currentTabState.totalPages = response.data.totalPages;

        config.tabs.tabsControl.setLoadmoreVisibility(
            currentTabState.currentPage < currentTabState.totalPages
        );
    }
}
