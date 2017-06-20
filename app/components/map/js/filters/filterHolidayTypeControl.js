'use strict';

import { config } from '../config';
import BaseComponent from 'generic/baseComponent';
import MediatorEvents from '../enums/mediatorEvents';
import MediatorEventModel from '../models/mediatorEventModel';

export default class FilterHolidayTypeControl extends BaseComponent {
    constructor() {
        super('filter-holiday-type');
        this._mediator = null;

        this.addListeners();
    }

    addListeners() {
        this.rootNode.addEventListener(
            'change',
            this.listeners.onChangeHandler = ( event ) => this._onChangeHandler(event)
        );
    }

    _onChangeHandler( event ) {
        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.filterPins;
        mediatorEvent.holidayType = event.target.value;
        config.mediator.stateChanged( mediatorEvent );
    }

    setMediator( mediator ) {
        this._mediator = mediator;
    }

    getValue() {
        return this.rootNode.value;
    }

    updateVisibility( shouldVisible ) {

        this.rootNode.classList[ shouldVisible ? 'add' : 'remove' ]('is-visible');

        // if ( shouldVisible ) {
        //     this.rootNode.classList.add( 'is-visible' );
        // } else {
        //     this.rootNode.classList.remove( 'is-visible' );
        // }
    }
}
