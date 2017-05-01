"use strict";

export default class MediatorEvents {
    constructor() {
    }

    static get levelChanged() {
        return 'LEVEL_CHANGED';
    }

    static get tabChanged() {
        return 'TAB_CHANGED';
    }

    static get airportPinClicked() {
        return 'AIRPORT_PIN_CLICKED';
    }

    static get destinationPinClicked() {
        return 'DESTINATION_PIN_CLICKED';
    }

    static get pinClicked() {
        return 'PIN_CLICKED';
    }

    static get levelBack() {

    }
}
