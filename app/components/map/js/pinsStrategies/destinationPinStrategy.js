"use strict";

import Config from '../config';
import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import HolidayTypeNames from '../enums/holidayTypeNames';
import MediatorEvents from '../enums/mediatorEvents';
import MarkerDestTemplate from '../../templates/markerDest.hbs';
import CardDestTemplate from '../../templates/cardDest.hbs';
import LocOverviewTemplate from '../../templates/locOverview.hbs';
import GenerateContentModel from '../models/generateContentModel';
import MediatorEventModel from '../models/mediatorEventModel';

export default class DestinationPinStrategy extends AbstractPinStrategy {
    constructor() {
        super();

        this.markerModifiers = {
            [HolidayTypeNames.beach]: 'marker-dest--beach',
            [HolidayTypeNames.city]: 'marker-dest--city',
            [HolidayTypeNames.villas]: 'marker-dest--villas',
        };

        this.viewModifiers = {
            [HolidayTypeNames.beach]: 'card-dest--beach',
            [HolidayTypeNames.city]: 'card-dest--city',
            [HolidayTypeNames.villas]: 'card-dest--villas',
        };
    }

    generateMultiplePins( pinsArray, holidayType = HolidayTypeNames.beach ) {
        return super.generateMultiplePins( pinsArray, PinNames.destination, holidayType );
    }

    generateMultipleContent( pinsArray, holidayType = HolidayTypeNames.beach ) {
        return super.generateMultipleContent( pinsArray, PinNames.destination, holidayType );
    }

    generateLocationInfo() {
        let locationPin = Config.instance.currentLocation;

        if ( locationPin.view ) {
            return locationPin.view;
        }

        let params = new GenerateContentModel();
        params.pin = locationPin;
        params.key = 'view';
        params.template = LocOverviewTemplate;

        super._generateContent( params );
        return locationPin.view;
    }

    _generatePin( pin ) {
        pin.markerModifiers = this.markerModifiers[pin.holidayType];

        let params = new GenerateContentModel();
        params.pin = pin;
        params.key = 'marker';
        params.template = MarkerDestTemplate;

        super._generateContent( params );
        return pin;
    }

    _generateView( pin ) {
        pin.viewModifiers = this.viewModifiers[pin.holidayType];

        let params = new GenerateContentModel();
        params.pin = pin;
        params.key = 'view';
        params.template = CardDestTemplate;

        super._generateContent( params );
        return pin;
    }

    onPinClick( pin ) {
        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.destinationPinClicked;
        mediatorEvent.targetPin = pin;
        Config.instance.mediator.stateChanged( mediatorEvent );
    }
}
