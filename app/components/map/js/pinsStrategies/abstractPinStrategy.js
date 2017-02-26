"use strict";

import Config from '../config';

export default class AbstractPinStrategy {
    constructor() {
    }

    generateMultiplePins( pinsArray, pinType, holidayType ) {
        let pins = [];

        if ( pinsArray === undefined ) {
            pinsArray = Config.instance.pinsArray;
        }

        pinsArray.forEach( ( pin ) => {
            if ( pin.type === pinType ) {
                pins.push( this._generatePin( pin ) );
            }
        } );

        return pins;
    }

    generateMultipleContent ( pinsArray, pinType ) {
        let views = [],
            view = null;

        if ( pinsArray === undefined ) {
            pinsArray = Config.instance.pinsArray;
        }

        pinsArray.forEach( ( pin ) => {
            if ( pin.type === pinType ) {
                if ( pin.view === undefined ) {
                    view = this._generateContent( pin );

                    if ( view !== null ) {
                        views.push( view );
                    }
                } else {
                    views.push( pin.view );
                }
            }
        });

        return views;
    }

    _generatePin ( pin ) {
        let marker = document.createElement( 'button' );
        marker.type = 'button';
        marker.innerHTML = pin.text;
        marker.className = 'marker js-marker';
        marker.setAttribute('data-id', pin.id);
        pin.marker = marker;

        return marker;
    }

    _generateContent( pin ) {
        let view = document.createElement('div');
        view.className = 'card';
        view.innerHTML = pin.text;
        view.setAttribute('data-id', pin.id);

        pin.view = view;
        return view;
    }

    hover() {
        console.log( 'base pin hover' );
    }
}
