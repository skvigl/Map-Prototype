'use strict';

import { config } from '../config';
import LevelNames from '../enums/levelNames';
import MediatorEvents from '../enums/mediatorEvents';
import MediatorEventModel from '../models/mediatorEventModel';

export default class FilterAirportControl {
    constructor() {
        this._elem = document.querySelector( '.js-filter-airport' );
        this._mediator = null;

        this.attachEvents();
    }

    attachEvents() {
        this._elem.addEventListener(
            'change',
            event => this._onChangeHandler( event )
        );
    }

    getValue() {
        return this._elem.value;
    }

    setValue( value ) {
        if ( this._elem.value !== value ) {
            this._elem.value = value;
        }
    }

    setMediator( mediator ) {
        this._mediator = mediator;
    }

    _onChangeHandler( event ) {
        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.filterPins;
        mediatorEvent.airportId = event.target.value;
        config.mediator.stateChanged( mediatorEvent );
    }

    updateVisibility( levelName ) {
        if ( levelName !== LevelNames.world ) {
            this._elem.classList.remove('is-visible');
        } else {
            this._elem.classList.add('is-visible');
        }
    }
}
