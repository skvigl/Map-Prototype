'use strict';

import {config} from '../config';
import BaseComponent from 'generic/baseComponent';
import MediatorEvents from '../enums/mediatorEvents';
import MediatorEventModel from '../models/mediatorEventModel';

export default class FilterAirportControl extends BaseComponent {
    constructor() {
        super( 'filter-airport' );
        this._mediator = null;

        this.addListeners();
    }

    addListeners() {
        this.rootNode.addEventListener(
            'change',
            this.listeners.onChangeHandler = ( event ) => this._onChangeHandler( event )
        );
    }

    _onChangeHandler( event ) {
        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.filterPins;
        mediatorEvent.airportId = event.target.value;
        config.mediator.stateChanged( mediatorEvent );
    }

    removeListeners() {
        this.rootNode.removeEventListener('change', this.listeners.onChangeHandler);
        delete this.listeners.onChangeHandler;
    }

    getValue() {
        return this.rootNode.value;
    }

    setValue( value ) {
        if ( this.rootNode.value !== value ) {
            this.rootNode.value = value;
        }
    }

    setMediator( mediator ) {
        this._mediator = mediator;
    }

    updateVisibility( shouldVisible ) {

        this.rootNode.classList[ shouldVisible ? 'add' : 'remove' ]('is-visible');

        if ( shouldVisible ) {
            this.rootNode.classList.add( 'is-visible' );
        } else {
            this.rootNode.classList.remove( 'is-visible' );
        }
    }
}
