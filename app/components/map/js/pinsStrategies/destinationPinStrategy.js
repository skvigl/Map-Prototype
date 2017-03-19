"use strict";

import Config from '../config';
import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import HolidayTypeNames from '../enums/holidayTypeNames';
import MediatorEvents from '../enums/mediatorEvents';
import MarkerDestinationTemplate from '../../templates/markerDestination.hbs';

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

    _generatePin ( pin ) {
        pin.modifierList = [];
        super._generatePin( pin, MarkerDestinationTemplate );
        return pin;
    }

    onPinClick( pin ) {
        Config.instance.mediator.stateChanged( MediatorEvents.destinationPinClicked, pin );
    }
}
