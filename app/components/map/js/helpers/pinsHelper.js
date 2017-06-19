'use strict';

import { config } from '../config';

export default class PinsHelper {
    constructor() {
    }

    static findPin( id ) {

        if ( !id ) {
            return null;
        }

        let pins = config.pins.data;

        for ( let i = 0, imax = pins.length; i < imax; i++ ) {
            if ( pins[i].id === id ) {
                return pins[i];
            }
        }

        return null;
    }

    static mergePin( targetPin, newPin ) {
        Object.assign( targetPin, newPin );
    }
}
