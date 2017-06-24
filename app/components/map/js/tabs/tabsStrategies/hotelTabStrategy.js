"use strict";

import { config } from '../../config';
import AbstractTabStrategy from './abstractTabStrategy';
import LevelNames from '../../enums/levelNames';
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
        switch ( config.levels.currentLevel.name ) {
            case LevelNames.country:
            case LevelNames.district:
            case LevelNames.resort:
                return new TabContent( null , this._generateCards( pins ) );
        }
    }
}
