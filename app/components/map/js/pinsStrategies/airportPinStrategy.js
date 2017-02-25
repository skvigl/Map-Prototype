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

    }

    hover() {
        console.log( 'airport pin hover' );
    }
}
