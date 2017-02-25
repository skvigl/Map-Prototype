"use strict";

import AbstractTabStrategy from './abstractTabStrategy';
import PinFactory from '../pinsStrategies/pinsFactory';
import PinNames from '../enums/pinNames';

export default class PoiTabStrategy extends AbstractTabStrategy {
    constructor( name ) {
        let allowedPinTypes = [
            PinFactory.getPinStrategy( PinNames.poi )
        ];
        super( allowedPinTypes, name );
    }

    generateContent( level ) {
        switch ( level ) {
            case 1:
            case 2:
            case 3:
                console.log( 'draw all pois' );
                break;
        }
    }
}
