"use strict";

import Config from '../config';
import MediatorEvents from '../enums/mediatorEvents';


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

    onPinClick( pin ) {
        let activePin = Config.instance.activePin;

        if ( activePin && activePin.marker ) {
            activePin.marker.classList.remove('is-active');
        }

        if ( pin.marker ) {
            pin.marker.classList.add('is-active');
        }

        Config.instance.mediator.stateChanged( MediatorEvents.pinClicked, pin );
    }

    onPinMouseover( pin ) {
        if ( pin.marker ) {
            pin.marker.classList.add('is-hover');
        }

        if ( pin.view ) {
            pin.view.classList.add('is-hover');
        }
    }

    onPinMouseout( pin ) {
        if ( pin.marker ) {
            pin.marker.classList.remove('is-hover');
        }

        if ( pin.view ) {
            pin.view.classList.remove('is-hover');
        }
    }

    _generatePin ( pin, template ) {
        pin.marker = this._html2dom( template( pin ) );
        return pin;
    }

    _generateContent( pin ) {
        let view = document.createElement('div');
        view.className = 'card';
        view.innerHTML = pin.text;
        view.setAttribute('data-id', pin.id);

        pin.view = view;
        return view;
    }

    _html2dom( html ) {
        let container = document.createElement('div');
        container.innerHTML = html;
        return container.firstChild;
    }
}
