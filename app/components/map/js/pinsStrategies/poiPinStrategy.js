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

    _generatePin ( pin ) {
        pin.modifierList = ['marker--poi'];
        super._generatePin( pin, 'marker');
        // let marker = document.createElement( 'button' );
        // marker.type = 'button';
        // marker.innerHTML = pin.text;
        // marker.className = 'marker js-marker';
        // marker.setAttribute('data-id', pin.id);
        // pin.marker = marker;

        return pin.marker;
    }

    _generateContent( pin ) {
        let view = document.createElement('div');
        view.className = 'card-poi';
        view.innerHTML = pin.text;
        view.setAttribute('data-id', pin.id);

        pin.view = view;
        return view;
    }

    hover() {
        console.log( 'poi pin hover' );
    }
}
