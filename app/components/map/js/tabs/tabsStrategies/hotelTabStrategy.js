"use strict";

import Config from '../../config';
import AbstractTabStrategy from './abstractTabStrategy';
import PinNames from '../../enums/pinNames';
import TabContent from '../tabContent';

export default class HotelTabStrategy extends AbstractTabStrategy {
    constructor( name ) {
        let allowedPinTypes = [
            PinNames.hotel
        ];
        super( allowedPinTypes, name );
    }

    generateContent( pins ) {
        switch ( Config.instance.currentLevel.levelId ) {
            case 1:
            case 2:
            case 3:
                return new TabContent( null , this._generateCards( pins ) );
        }
    }
}
