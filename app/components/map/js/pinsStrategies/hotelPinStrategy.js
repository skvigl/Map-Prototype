"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import MarkerTemplate from '../../templates/marker.hbs';
import CardHotelTemplate from '../../templates/cardHotel.hbs';

export default class HotelPinStrategy extends AbstractPinStrategy {
    constructor() {
        super();
    }

    generateMultiplePins( pinsArray ) {
        return super.generateMultiplePins( pinsArray, PinNames.hotel );
    }

    generateMultipleContent( pinsArray ) {
        return super.generateMultipleContent( pinsArray, PinNames.hotel );
    }

    _generatePin ( pin ) {
        pin.modifierList = ['marker--hotel'];
        super._generateContent( pin, 'marker', MarkerTemplate );
        return pin;
    }

    _generateView( pin ) {
        pin.modifierList = [];
        super._generateContent( pin, 'view', CardHotelTemplate );
        return pin;
    }
}
