"use strict";

import Config from '../config';
import AbstractTabStrategy from './abstractTabStrategy';
import PinNames from '../enums/pinNames';
import TabContent from '../tabContent';

export default class PoiTabStrategy extends AbstractTabStrategy {
    constructor( name ) {
        let allowedPinTypes = [
            PinNames.poi
            //PinFactory.getPinStrategy( PinNames.poi )
        ];
        super( allowedPinTypes, name );
    }

    generateContent() {
        switch ( Config.instance.currentLevel.levelId ) {
            case 1:
            case 2:
            case 3:
                console.log( 'draw all pois' );
                return new TabContent( null , this._generateCards() );
        }
    }
}
