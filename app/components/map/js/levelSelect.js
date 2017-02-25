"use strict";

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
        return this._elem.value;
    }

    _changeHadler() {
        this._mediator.stateChanged( this );
    }
}
