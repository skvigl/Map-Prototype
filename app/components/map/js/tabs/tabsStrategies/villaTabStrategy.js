"use strict";

import AbstractTabStrategy from './abstractTabStrategy';
import PinNames from '../../enums/pinNames';
import TabContent from '../tabContent';

export default class VillaTabStrategy extends AbstractTabStrategy {
    constructor( name ) {
        let allowedPinTypes = [
            PinNames.villa
        ];
        super( allowedPinTypes, name );
    }

    generateContent( pins ) {
        switch ( config.currentLevel.levelId ) {
            case 0:
                console.log( 'tab is hidden' );
                break;
            case 1:
            case 2:
            case 3:
                console.log( 'draw all hotel' );
                return new TabContent( null , this._generateCards( pins ) );
                break;
        }
    }
}
