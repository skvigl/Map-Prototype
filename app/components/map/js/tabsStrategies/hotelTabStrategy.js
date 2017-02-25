"use strict";

import AbstractTabStrategy from './abstractTabStrategy';
import PinFactory from '../pinsStrategies/pinsFactory';
import PinNames from '../enums/pinNames';

export default class HotelTabStrategy extends AbstractTabStrategy {
    constructor( name ) {
        let allowedPinTypes = [
            PinFactory.getPinStrategy( PinNames.hotel )
        ];
        super( allowedPinTypes, name );
    }

    generateContent( level ) {
        switch ( level ) {
            case 0:
                console.log( 'tab is hidden' );
                break;
            case 1:
            case 2:
            case 3:
                console.log( 'draw all hotel' );
                break;
        }
    }
}
