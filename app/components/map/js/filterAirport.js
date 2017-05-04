'use strict';

export default class FilterAirport {
    constructor(){
        this._elem = document.querySelector( '.js-filter-airport' );
        this._mediator = null;

        this.attachEvents();
    }

    attachEvents() {
        this._elem.addEventListener(
            'change',
            event => this._onChangeHandler(event)
        );
    }
    
    getValue() {
        return this._elem.value;
    }

    setMediator( mediator ) {
        this._mediator = mediator;
    }   

    _onChangeHandler( event ) {
        console.log( event.target.value );
    }   
}
