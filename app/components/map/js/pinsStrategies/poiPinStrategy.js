"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import MarkerTemplate from '../../templates/marker.hbs';

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
        super._generatePin( pin, MarkerTemplate );
        return pin;
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
