"use strict";

import { config } from '../../config';
import TabContent from '../tabContent';

export default class AbstractTabStrategy {
    constructor( pinStrategies, name ) {
        this._name = name;
        this._pinStrategies = pinStrategies;
    }

    getPinStrategies() {
        return this._pinStrategies;
    }

    updatePinStrategies() {
    }

    hasDetails() {
        return true;
    }

    generateDetailsCard( pin ) {

        if ( !pin.detailsView ) {
            config.pins.strategies[pin.type].generateDetailsContent( pin );
        }

        return new TabContent( null, null, pin.detailsView );
    }

    getDetailsCard( pin ) {
        return new TabContent( null, null, pin.detailsView );
    }

    _generateCards( pins ) {
        let cards = [];

        this._pinStrategies.forEach( strategy => {
            let newContent = config.pins.strategies[strategy].generateMultipleContent( pins );

            if ( newContent ) {
                cards = cards.concat( newContent );
            }

        } );

        return cards;
    }
}
