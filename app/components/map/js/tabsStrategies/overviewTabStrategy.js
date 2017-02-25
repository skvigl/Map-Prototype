"use strict";

import AbstractTabStrategy from './abstractTabStrategy';
import PinFactory from '../pinsStrategies/pinsFactory';
import PinNames from '../enums/pinNames';

export default class OverviewTabStrategy extends AbstractTabStrategy {
    constructor( name, level ) {
        let allowedPinTypes = null;

        switch ( level ) {
            case 0:
            case 1:
            case 2:
                allowedPinTypes = [
                    PinFactory.getPinStrategy( PinNames.airport ),
                    PinFactory.getPinStrategy( PinNames.destination )
                ];
                break;
            case 3:
                allowedPinTypes = [
                    PinFactory.getPinStrategy( PinNames.airport ),
                    PinFactory.getPinStrategy( PinNames.poi ),
                    PinFactory.getPinStrategy( PinNames.hotel ),
                ];
                break;
        }

        super( allowedPinTypes, name );
    }

    generateContent( level ) {
        switch ( level ) {
            case 0:
                console.log( 'draw all locations in tab' );
                break;
            case 1:
                console.log( 'draw location info + all child location' );
                break;
            case 2:
                console.log( 'draw location info + all child location' );
                break;
            case 3:
                console.log( 'draw location info' );
                break;
        }
    }
}
