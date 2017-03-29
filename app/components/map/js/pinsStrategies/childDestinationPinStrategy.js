"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import HolidayTypeNames from '../enums/holidayTypeNames';
import MarkerChildDestTemplate from '../../templates/markerChildDest.hbs';
import GenerateContentModel from '../models/generateContentModel';

export default class ChildDestinationPinStrategy extends AbstractPinStrategy {
    constructor() {
        super();

        this.markerModifiers = {
            [HolidayTypeNames.beach]: 'marker-child--beach',
            [HolidayTypeNames.city]: 'marker-child--city',
            [HolidayTypeNames.villas]: 'marker-child--villas',
        };

        this.viewModifiers = {
            [HolidayTypeNames.beach]: 'card-dest--beach',
            [HolidayTypeNames.city]: 'card-dest--city',
            [HolidayTypeNames.villas]: 'card-dest--villas',
        };
    }

    generateMultiplePins( pinsArray, holidayType = HolidayTypeNames.beach  ) {
        return super.generateMultiplePins( pinsArray, PinNames.childDestination, holidayType );
    }

    generateMultipleContent( pinsArray ) {
        return null;
    }

    _generatePin( pin ) {
        pin.markerModifiers = this.markerModifiers[pin.holidayType];

        let params = new GenerateContentModel();
        params.pin = pin;
        params.key = 'marker';
        params.template = MarkerChildDestTemplate;

        super._generateContent( params );
        return pin;
    }

}
