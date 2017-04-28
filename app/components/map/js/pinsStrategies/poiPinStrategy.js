"use strict";

import AbstractPinStrategy from './abstractPinStrategy';
import PinNames from '../enums/pinNames';
import MarkerTemplate from '../../templates/marker.hbs';
import CardPoiTemplate from '../../templates/cardPoi.hbs';
import CardPoiDetailsTemplate from '../../templates/cardPoiDetails.hbs';
import GenerateContentModel from '../models/generateContentModel';

export default class PoiPinStrategy extends AbstractPinStrategy {
    constructor() {
        super();
    }

    generateMultiplePins( pinsArray ) {
        return super.generateMultiplePins( pinsArray, PinNames.poi );
    }

    generateMultipleContent( pinsArray ) {
        return super.generateMultipleContent( pinsArray, PinNames.poi );
    }

    _generatePin ( pin ) {
        pin.markerModifiers = 'marker--poi';

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
        params.template = CardPoiTemplate;

        super._generateContent( params );
        return pin;
    }

    _generateDetailsView( pin ) {
        pin.viewModifiers = '';

        let params = new GenerateContentModel();
        params.pin = pin;
        params.key = 'detailsView';
        params.template = CardPoiDetailsTemplate;

        super._generateContent( params );
        return pin;
    }

}
