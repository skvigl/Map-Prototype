'use strict';

export default class FilterHolidayType {
    constructor(){
        this._elem = document.querySelector( '.js-filter-holiday-type' );
        this._mediator = null;

        this.attachEvents();
    }

    attachEvents() {
        this._elem.addEventListener(
            'change',
            event => this._onChangeHandler(event)
        );
    }

    setMediator( mediator ) {
        this._mediator = mediator;
    }

    getValue() {
        return this._elem.value;
    }

    _onChangeHandler( event ) {
        console.log( event.target.value );
    }


}
