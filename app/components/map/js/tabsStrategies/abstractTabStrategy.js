"use strict";

import Config from '../config';

export default class AbstractTabStrategy {
    constructor( pinStrategies, name ) {
        this._name = name;
        this._pinStrategies = pinStrategies;
    }

    getPinStrategies() {
        return this._pinStrategies;
    }

    getName() {
        return this._name;
    }

    updatePinStrategies() {}

    _generateCards() {
        let cards = [];

        this._pinStrategies.forEach( strategy => {
            let newContent = Config.instance.pinStrategies[ strategy ].generateMultipleContent();

            if ( newContent ) {
                cards = cards.concat( newContent );
            }

        });

        return cards;
    }
}
