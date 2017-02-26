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

    _generateContent( pin ) {
        let view = document.createElement('div');
        view.className = 'card-poi';
        view.innerHTML = pin.text;

        pin.view = view;
        console.log( 'base pin content draw' );
        return view;
    }

    hover() {
        console.log( 'poi pin hover' );
    }
}
