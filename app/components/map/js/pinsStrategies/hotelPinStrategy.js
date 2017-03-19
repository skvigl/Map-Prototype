"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import MarkerTemplate from '../../templates/marker.hbs';

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
        super._generatePin( pin, MarkerTemplate );
        return pin;
    }

    _generateContent( pin ) {
        pin.modifierList = ['marker--poi'];
        let view = document.createElement('div');
        view.className = 'card-hotel';
        view.innerHTML = pin.text;
        view.setAttribute('data-id', pin.id);

        pin.view = view;
        return view;
    }

    hover() {
        console.log( 'hotel pin hover' );
    }
}
