"use strict";

import MediatorEvents from './enums/mediatorEvents';

export default class LevelSelect {
    constructor() {
        this._elem = document.querySelector( '.js-level' );
        this._eventHandlers = {};
        this._mediator = null;
    }

    init() {
        this._eventHandlers['changehandler'] = this._changeHadler.bind( this );
        this._elem.addEventListener( 'change', this._eventHandlers['changehandler'] );
    }

    setMediator( mediator ) {
        this._mediator = mediator;
    }

    getCurrentLevel() {
        return +this._elem.value;
    }

    setCurrentLevel( level ) {
        this._elem.value = level;
        this._changeHadler();
    }

    _changeHadler() {
        this._mediator.stateChanged( MediatorEvents.levelChanged );
    }
}
