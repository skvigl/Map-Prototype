export default class MediatorEvents {
    static get levelChanged() {
        return 'LEVEL_CHANGED';
    }

    static get tabChanged() {
        return 'TAB_CHANGED';
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
