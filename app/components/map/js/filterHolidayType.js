'use strict';

import Config from './config';
import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';

export default class FilterHolidayType {
    constructor(){
        this._elem = document.querySelector( '.js-filter-holiday-type' );
        this._mediator = null;

        this.attachEvents();
    }

    attachEvents() {
        this._elem.addEventListener(
            'change',
            event => this._onChangeHandler(event)
        );
    }

    setMediator( mediator ) {
        this._mediator = mediator;
    }

    getValue() {
        return this._elem.value;
    }

    _onChangeHandler( event ) {
        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.filterPins;
        mediatorEvent.holidayType = event.target.value;
        Config.instance.mediator.stateChanged( mediatorEvent );
    }

    updateVisibility( level ) {
        if ( level > 0 ) {
            this._elem.classList.remove('is-visible');
        } else {
            this._elem.classList.add('is-visible');
        }
    }
}
