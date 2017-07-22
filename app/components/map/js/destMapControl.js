import BaseComponent from 'generic/baseComponent';
import { config } from './config';
import LevelNames from './enums/levelNames';
import PinNames from './enums/pinNames';
import TabNames from './enums/tabNames';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';
import PinsHelper from './helpers/pinsHelper';

export default class DestMapControl extends BaseComponent {
    constructor() {
        super( 'dest-map' );
        this.prefix = 'dm';
        this.init();
    }

    init() {
        this.btnBackToLevel = this.rootNode.querySelector( '[data-dm-elem=back-to-level]' );

        this.addListeners();
    }

    initLevel() {
        const mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.levelChanged;
        mediatorEvent.levelName = LevelNames.world;
        mediatorEvent.pinType = PinNames.destination;
        mediatorEvent.tabName = TabNames.overview;
        config.mediator.stateChanged( mediatorEvent );
    }

    destroy() {
        this.removeListeners();
    }

    drawAllPins() {
        config.tabs.currentTab.getPinStrategies().forEach( ( strategy ) => {
            this._drawPinsByStrategy( strategy );
        } );
        config.maps.destMapControl.updatePinsVisibility();
    }

    removeAllPins() {
        config.pins.data.forEach( ( pin ) => {
            config.maps.googleMapControl.removeMarker( pin );
        } );
    }

    hideAllPins() {
        config.pins.data.forEach( ( pin ) => {
            if ( pin.marker ) {
                pin.marker.classList.remove( 'is-visible' );
            }
        } );
    }

    updatePinsVisibility() {
        config.tabs.currentTab.getPinStrategies().forEach( ( strategy ) => {
            this._updatePinsVisibilityByStrategy( strategy );
        } );
    }

    updateBtnBackToLevelVisibility( isVisible ) {
        if ( isVisible ) {
            this.btnBackToLevel.classList.remove( 'is-hidden' );
        } else {
            this.btnBackToLevel.classList.add( 'is-hidden' );
        }
    }

    updateFiltersVisibility( levelName ) {
        if ( levelName === LevelNames.world ) {
            config.filters.filterAirportControl.updateVisibility( true );
            config.filters.filterHolidayTypeControl.updateVisibility( true );
        } else {
            config.filters.filterAirportControl.updateVisibility( false );
            config.filters.filterHolidayTypeControl.updateVisibility( false );
        }
    }

    addLoadingClass() {
        this.rootNode.classList.add( 'is-loading' );
    }

    removeLoadingClass() {
        this.rootNode.classList.remove( 'is-loading' );
    }

    _drawPinsByStrategy( strategy ) {
        const currentPinStrategy = config.pins.strategies[strategy],
            pins = currentPinStrategy.generateMultiplePins();

        pins.forEach( ( pin ) => {
            config.maps.googleMapControl.addMarker( pin );
        } );
    }

    _updatePinsVisibilityByStrategy( strategy ) {
        const currentPinStrategy = config.pins.strategies[strategy],
            pins = currentPinStrategy.generateMultiplePins();

        pins.forEach( ( pin ) => {
            if ( currentPinStrategy.checkPinVisibility( pin ) ) {
                pin.marker.classList.add( 'is-visible' );

                if ( pin.view ) {
                    pin.view.classList.add( 'is-visible' );
                }
            } else {
                pin.marker.classList.remove( 'is-visible' );

                if ( pin.view ) {
                    pin.view.classList.remove( 'is-visible' );
                }
            }
        } );
    }

    addListeners() {
        this.rootNode.addEventListener(
            'click',
            this.listeners.onClickMarkerHandler = () => this._onClickPinHandler( event, 'marker' )
        );

        this.rootNode.addEventListener(
            'click',
            this.listeners.onClickCardHandler = () => this._onClickPinHandler( event, 'card' )
        );

        this.rootNode.addEventListener(
            'mouseover',
            this.listeners.onMouseoverMarkerHandler = () => this._onMouseoverPinHandler( event, 'marker' )
        );

        this.rootNode.addEventListener(
            'mouseover',
            this.listeners.onMouseoverCardHandler = () => this._onMouseoverPinHandler( event, 'card' )
        );

        this.rootNode.addEventListener(
            'mouseout',
            this.listeners.onMouseoutMarkerHandler = () => this._onMouseoutPinHandler( event, 'marker' )
        );

        this.rootNode.addEventListener(
            'mouseout',
            this.listeners.onMouseoutCardHandler = () => this._onMouseoutPinHandler( event, 'card' )
        );

        this.rootNode.addEventListener(
            'click',
            this.listeners.onClickBtnLevelBackHandler = () => this._onClickBtnLevelBackHandler( event, 'back-to-level' )
        );

        this.rootNode.addEventListener(
            'click',
            this.listeners.onClickBtnViewOnMapHandler = () => this._onClickBtnViewOnMapHandler( event, 'view-on-map' )
        );
    }

    _onClickPinHandler( event, elemName ) {
        const pin = this._getEventTargetPin( event, elemName );

        if ( !pin ) return;

        config.pins.strategies[pin.type].onPinClick( pin );
    }

    _onMouseoverPinHandler( event, elemName ) {
        const pin = this._getEventTargetPin( event, elemName );

        if ( !pin ) return;

        config.pins.strategies[pin.type].onPinMouseover( pin );
    }

    _onMouseoutPinHandler( event, elemName ) {
        const pin = this._getEventTargetPin( event, elemName );

        if ( !pin ) return;

        config.pins.strategies[pin.type].onPinMouseout( pin );
    }

    _onClickBtnLevelBackHandler( event, elemName ) {
        const target = this._findElemNode( event.target, this.rootNode, elemName );

        if ( !target ) return;

        const targetLocation = config.levels.locationsHistory.pop();

        if ( !targetLocation ) return;

        const mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.levelChanged;
        mediatorEvent.levelName = targetLocation.levelName;
        mediatorEvent.pinType = PinNames.destination;
        mediatorEvent.targetPin = targetLocation;
        config.mediator.stateChanged( mediatorEvent );
    }

    _onClickBtnViewOnMapHandler( event, elemName ) {
        const target = this._findElemNode( event.target, this.rootNode, elemName );

        if ( !target ) return;

        const pin = this._getEventTargetPin( event, elemName );

        if ( !pin ) return;

        config.maps.googleMapControl.setCenter( {
            lat: pin.lat,
            lng: pin.lng
        } );

        const activePin = config.pins.activePin;

        if ( activePin ) {
            config.pins.strategies[activePin.type].removeActiveClass( activePin );
        }

        config.pins.activePin = pin;
        config.pins.strategies[pin.type].addActiveClass( pin );
    }

    _getEventTargetPin( event, elemName ) {
        const target = this._findElemNode( event.target, this.rootNode, elemName );

        if ( !target ) return null;

        const id = target.getAttribute( 'data-dm-pin-id' );

        return PinsHelper.findPin( id );
    }
}
