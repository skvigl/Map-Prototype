"use strict";

import AbstractTabStrategy from './abstractTabStrategy';
import PinFactory from '../pinsStrategies/pinsFactory';
import PinNames from '../enums/pinNames';

export default class MobileOverviewTabStrategy extends AbstractTabStrategy {
    constructor( name, level, isCityBreak = false ) {
        let allowedPinTypes = [
            PinFactory.getPinStrategy( PinNames.airport ),
            PinFactory.getPinStrategy( PinNames.destination )//,
            //PinFactory.getPinStrategy( 'childDestination' )
        ];

        if ( ( isCityBreak && level == 2 ) || level == 3 ) {
            allowedPinTypes.push( PinFactory.getPinStrategy( PinNames.poi ) );
            allowedPinTypes.push( PinFactory.getPinStrategy( PinNames.hotel ) );
        }

        super( allowedPinTypes, name );
    }

    generateContent( level ) {
        switch ( level ) {
            case 0:
            case 1:
            case 2:
            case 3:
                console.log( 'draw location info' );
                break;
        }
    }
}
