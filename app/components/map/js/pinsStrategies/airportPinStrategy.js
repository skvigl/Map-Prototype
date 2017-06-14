"use strict";

import { config } from '../config';
import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import MarkerTemplate from '../../templates/marker.hbs';
import GenerateContentModel from '../models/generateContentModel';
import MediatorEvents from '../enums/mediatorEvents';
import MediatorEventModel from '../models/mediatorEventModel';

export default class AirportPinStrategy extends AbstractPinStrategy {
    constructor() {
        super();
    }

    generateMultiplePins( pinsArray ) {
        return super.generateMultiplePins( pinsArray, PinNames.airport );
    }

    generateMultipleContent( pinsArray ) {
        return null;
    }

    onPinClick( pin ) {

        if ( config.currentLevel.levelId === 0 ) {

            let activePin = config.activePin;

            if ( activePin && activePin.marker ) {
                activePin.marker.classList.remove( 'is-active' );
            }

            if ( pin && pin.marker ) {
                pin.marker.classList.add( 'is-active' );
            }

            let mediatorEvent = new MediatorEventModel();
            mediatorEvent.eventType = MediatorEvents.filterPins;
            mediatorEvent.airportId = pin.id;
            mediatorEvent.targetPin = pin;
            config.mediator.stateChanged( mediatorEvent );
        }
    }

    _generatePin ( pin ) {
        pin.markerModifiers = 'marker--airport';

        let params = new GenerateContentModel();
        params.pin = pin;
        params.key = 'marker';
        params.template = MarkerTemplate;

        super._generateContent( params );
        return pin;
    }
}
