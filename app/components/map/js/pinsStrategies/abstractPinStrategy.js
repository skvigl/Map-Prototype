"use strict";

export default class AbstractPinStrategy {
    constructor() {
    }

    _generatePin ( pin ) {
        let marker = document.createElement( 'button' );
        marker.type = 'button';
        marker.innerHTML = pin.text;
        marker.className = 'marker';

        return marker;
    }

    generateMultiplePins( pinsArray, pinType, holidayType ) {
        let pins = [];

        pinsArray.forEach( ( pin ) => {
            if ( pin.type === pinType ) {
                pins.push( this._generatePin( pin ) );
            }
        } );

        return pins;
    }

    generateMultipleContent ( pinsArray, pinType ) {
        let views = [];

        pinsArray.forEach( ( pin ) => {
            if ( pin.type === pinType ) {
                if ( pin.view === undefined ) {
                    views.push( this._generateContent( pin ) );
                }
            }
        });

        return views;
    }

    _generateContent( pin ) {
        let view = document.createElement('div');
        view.className = 'card';
        view.innerHTML = pin.text;

        pin.view = view;
        console.log( 'base pin content draw' );
        return view;
    }

    hover() {
        console.log( 'base pin hover' );
    }
}
