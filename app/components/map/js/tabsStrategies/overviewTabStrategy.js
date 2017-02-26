"use strict";

import Config from '../config';
import AbstractTabStrategy from './abstractTabStrategy';
import PinFactory from '../pinsStrategies/pinsFactory';
import PinNames from '../enums/pinNames';
import TabContent from '../tabContent';

export default class OverviewTabStrategy extends AbstractTabStrategy {
    constructor( name, level ) {
        let allowedPinStratagies = null;

        switch ( level ) {
            case 0:
            case 1:
            case 2:
                allowedPinStratagies = [
                    PinFactory.getPinStrategy( PinNames.airport ),
                    PinFactory.getPinStrategy( PinNames.destination )
                ];
                break;
            case 3:
                allowedPinStratagies = [
                    PinFactory.getPinStrategy( PinNames.airport ),
                    PinFactory.getPinStrategy( PinNames.poi ),
                    PinFactory.getPinStrategy( PinNames.hotel ),
                ];
                break;
        }

        super( allowedPinStratagies, name );
    }

    generateContent() {

        switch ( Config.instance.currentLevel.levelId ) {
            case 0:
                console.log( 'draw all locations in tab' );
                return new TabContent( null, this._generateCards() );
            case 1:
                console.log( 'draw location info + all child location' );
                return new TabContent( this._generateLocationInfo(), this._generateCards() );
            case 2:
                console.log( 'draw location info + all child location' );
                return new TabContent( this._generateLocationInfo(), this._generateCards() );
            case 3:
                console.log( 'draw location info' );
                return new TabContent( this._generateLocationInfo(), null );
        }
    }

    _generateLocationInfo () {

        return '';
    }
}
