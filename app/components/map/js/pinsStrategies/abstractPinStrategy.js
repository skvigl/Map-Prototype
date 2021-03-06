/* globals google */
/* eslint-disable no-unused-vars */

import { config } from '../config';
import MediatorEvents from '../enums/mediatorEvents';
import MediatorEventModel from '../models/mediatorEventModel';


export default class AbstractPinStrategy {
    generateMultiplePins( pinsArray, pinType, holidayType ) {
        const pins = [];

        if ( pinsArray === undefined ) {
            pinsArray = config.pins.data;
        }

        pinsArray.forEach( ( pin ) => {
            if ( pin.type === pinType ) {
                pins.push( this._generatePin( pin ) );
            }
        } );

        return pins;
    }

    generateMultipleContent( pinsArray, pinType ) {
        const views = [];

        if ( pinsArray === undefined ) {
            pinsArray = config.pins.data;
        }

        pinsArray.forEach( ( pin ) => {
            if ( pin.type === pinType ) {
                if ( pin.view === undefined ) {
                    this._generateView( pin );

                    if ( pin.view !== null ) {
                        views.push( pin.view );
                    }
                } else {
                    views.push( pin.view );
                }
            }
        } );

        return views;
    }

    generateDetailsContent( pin ) {
        return this._generateDetailsView( pin );
    }

    onPinClick( pin ) {
        const activePin = config.pins.activePin;

        if ( activePin && activePin.marker ) {
            activePin.marker.classList.remove( 'is-active' );
        }

        if ( pin && pin.marker ) {
            pin.marker.classList.add( 'is-active' );
        }

        const mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.pinClicked;
        mediatorEvent.targetPin = pin;

        config.mediator.stateChanged( mediatorEvent );
    }

    onPinMouseover( pin ) {
        if ( !pin ) return;

        if ( pin.marker ) {
            pin.marker.classList.add( 'is-hover' );
            pin.richMarker.setPosition( new google.maps.LatLng(pin.lat || 0, pin.lng || 0) );
        }

        if ( pin.view ) {
            pin.view.classList.add( 'is-hover' );
        }
    }

    onPinMouseout( pin ) {
        if ( !pin ) return;

        if ( pin.marker ) {
            pin.marker.classList.remove( 'is-hover' );
            pin.richMarker.setPosition( new google.maps.LatLng(pin.lat || 0, pin.lng || 0) );
        }

        if ( pin.view ) {
            pin.view.classList.remove( 'is-hover' );
        }
    }

    checkPinVisibility( pin ) {
        return true;
    }

    addActiveClass( pin ) {
        if ( pin && pin.marker ) {
            pin.marker.classList.add( 'is-active' );
            pin.richMarker.setPosition( new google.maps.LatLng(pin.lat || 0, pin.lng || 0) );
        }
    }

    removeActiveClass( pin ) {
        if ( pin && pin.marker ) {
            pin.marker.classList.remove( 'is-active' );
            pin.richMarker.setPosition( new google.maps.LatLng(pin.lat || 0, pin.lng || 0) );
        }
    }

    _generateContent( params ) {
        if ( !params.pin[params.key] ) {
            params.pin[params.key] = this._html2dom( params.template( params.pin ) );
        }

        return params.pin;
    }

    _generatePin() {
    }

    _generateView() {
    }

    _generateDetailsView() {
    }

    _html2dom( html ) {
        const container = document.createElement( 'div' );
        container.innerHTML = html;
        return container.firstChild;
    }
}
