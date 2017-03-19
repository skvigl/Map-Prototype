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

    drawContent( level ) {
    }

    getName() {
        return this._name;
    }

    updatePinStrategies() {

    }

    _generateCards() {
        let cards = [];

        this._pinStrategies.forEach( strategy => {
            cards = cards.concat( Config.instance.pinStrategies[ strategy ].generateMultipleContent() );
        });

        return cards;
    }
}
