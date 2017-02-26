"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import HolidayTypeNames from '../enums/holidayTypeNames';

export default class DestinationPinStrategy extends AbstractPinStrategy {
    constructor() {
        super();
    }

    generateMultiplePins( pinsArray, holidayType = HolidayTypeNames.beach ) {
        return super.generateMultiplePins( pinsArray, PinNames.destination, holidayType );
    }

    generateMultipleContent( pinsArray, holidayType = HolidayTypeNames.beach ) {
        return super.generateMultipleContent( pinsArray, PinNames.destination, holidayType );
    }

    onHover() {
        console.log( 'destination pin hover' );
    }

    onClick() {

    }
}
