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

    static get hideDetails() {
        return 'HIDE_DETAILS';
    }

    static get filterPins() {
        return 'FILTER_PINS';
    }

    static get loadmorePinsDetails() {
        return 'LOADMORE_PINS_DETAILS';
    }
}
