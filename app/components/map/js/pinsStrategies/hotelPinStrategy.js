"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import MarkerTemplate from '../../templates/marker.hbs';
import CardHotelTemplate from '../../templates/cardHotel.hbs';
import CardHotelDetailsTemplate from '../../templates/cardHotelDetails.hbs';
import GenerateContentModel from '../models/generateContentModel';

export default class HotelPinStrategy extends AbstractPinStrategy {
    constructor() {
        super();
    }

    generateMultiplePins( pinsArray ) {
        return super.generateMultiplePins( pinsArray, PinNames.hotel );
    }

    generateMultipleContent( pinsArray ) {
        return super.generateMultipleContent( pinsArray, PinNames.hotel );
    }

    _generatePin ( pin ) {
        pin.markerModifiers = 'marker--hotel';

        let params = new GenerateContentModel();
        params.pin = pin;
        params.key = 'marker';
        params.template = MarkerTemplate;

        super._generateContent( params );
        return pin;
    }

    _generateView( pin ) {
        pin.viewModifiers = '';

        let params = new GenerateContentModel();
        params.pin = pin;
        params.key = 'view';
        params.template = CardHotelTemplate;

        super._generateContent( params );
        return pin;
    }

    _generateDetailsView( pin ) {
        pin.viewModifiers = '';

        let params = new GenerateContentModel();
        params.pin = pin;
        params.key = 'detailsView';
        params.template = CardHotelDetailsTemplate;

        super._generateContent( params );
        return pin;
    }
}
