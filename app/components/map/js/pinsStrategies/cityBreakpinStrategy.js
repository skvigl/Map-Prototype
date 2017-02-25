"use strict";

import DestinationPinStrategy from './destinationPinStrategy';
import HolidayTypeNames from '../enums/holidayTypeNames';

export default class CityBreakPinStrategy extends DestinationPinStrategy {
    constructor() {
        super();
    }

    generateMultiplePins( pinsArray ) {
        return super.generateMultiplePins( pinsArray, HolidayTypeNames.city );
    }

    generateMultipleContent( pinsArray ) {
        return super.generateMultipleContent( pinsArray, HolidayTypeNames.city );
    }

    hover() {
        console.log( 'cityBreak pin hover' );
    }
}
