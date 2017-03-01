"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';

export default class AirportPinStrategy extends AbstractPinStrategy {
    constructor() {
        super();
    }

    generateMultiplePins( pinsArray ) {
        return super.generateMultiplePins( pinsArray, PinNames.airport );
    }

    generateMultipleContent( pinsArray ) {
        return null;
    }

    onPinClick( pin ) {
        super.onPinClick( pin );
    }

    hover() {
        console.log( 'airport pin hover' );
    }

    _generatePin ( pin ) {
        let marker = document.createElement( 'button' );
        marker.type = 'button';
        marker.innerHTML = '<strong>' +  pin.text + '</strong>';
        marker.className = 'marker marker--airport js-marker';
        marker.setAttribute('data-id', pin.id);
        pin.marker = marker;

        return pin;
    }
}
