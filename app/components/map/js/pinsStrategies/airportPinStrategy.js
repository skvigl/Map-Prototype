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

    _generatePin ( pin ) {
        pin.modifierList = ['marker--airport'];
        super._generateContent( pin, 'marker', MarkerTemplate );
        return pin;
    }
}
