"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import MarkerTemplate from '../../templates/marker.hbs';

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
        pin.modifierList = ['marker--airport'];
        super._generatePin( pin, MarkerTemplate );
        return pin;
    }
}
