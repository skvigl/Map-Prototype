"use strict";

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

    _generateCards() {
        let cards = [];

        this._pinStrategies.forEach( strategy => {
            cards = cards.concat( strategy.generateMultipleContent() );
        });

        return cards;
    }
}
