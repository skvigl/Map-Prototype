"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';

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

    _generateContent( pin ) {
        let view = document.createElement('div');
        view.className = 'card-hotel';
        view.innerHTML = pin.text;

        pin.view = view;
        console.log( 'base pin content draw' );
        return view;
    }

    hover() {
        console.log( 'hotel pin hover' );
    }
}
