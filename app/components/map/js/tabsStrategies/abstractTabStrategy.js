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
}
