"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';

export default class PoiPinStrategy extends AbstractPinStrategy {
    constructor() {
        super();
    }

    generateMultiplePins( pinsArray ) {
        return super.generateMultiplePins( pinsArray, PinNames.poi );
    }

    generateMultipleContent( pinsArray ) {
        return super.generateMultipleContent( pinsArray, PinNames.poi );
    }

    hover() {
        console.log( 'poi pin hover' );
    }
}
