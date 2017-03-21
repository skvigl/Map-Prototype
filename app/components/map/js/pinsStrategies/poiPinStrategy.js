"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import MarkerTemplate from '../../templates/marker.hbs';
import CardPoiTemplate from '../../templates/cardPoi.hbs';

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

    _generatePin ( pin ) {
        pin.modifierList = ['marker--poi'];
        super._generateContent( pin, 'marker', MarkerTemplate );
        return pin;
    }

    _generateView( pin ) {
        pin.modifierList = [];
        super._generateContent( pin, 'view', CardPoiTemplate );
        return pin;
    }

}
