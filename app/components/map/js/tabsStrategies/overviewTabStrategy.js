"use strict";

import Config from '../config';
import AbstractTabStrategy from './abstractTabStrategy';
import PinNames from '../enums/pinNames';
import TabContent from '../tabContent';

export default class OverviewTabStrategy extends AbstractTabStrategy {
    constructor( name ) {
        super( [], name );
        this.updatePinStrategies();
    }

    updatePinStrategies() {
        let allowedPinStratagies = null,
            currentLevel = Config.instance.currentLevel,
            levelId = 0;

        if ( currentLevel && currentLevel.levelId ) {
            levelId = currentLevel.levelId;
        }

        switch ( levelId ) {
            case 0:
                allowedPinStratagies = [
                    PinNames.airport,
                    PinNames.destination,
                ];
                break;
            case 1:
                allowedPinStratagies = [
                    PinNames.airport,
                    PinNames.destination,
                    PinNames.childDestination,
                ];
                break;
            case 2:
                allowedPinStratagies = [
                    PinNames.airport,
                    PinNames.destination,
                ];
                break;
            case 3:
                allowedPinStratagies = [
                    PinNames.airport,
                    PinNames.poi,
                    PinNames.hotel
                ];
                break;
        }

        this._pinStrategies = allowedPinStratagies;
    }

    generateContent() {

        switch ( Config.instance.currentLevel.levelId ) {
            case 0:
                console.log( 'draw all locations in tab' );
                return new TabContent( null, this._generateCards() );
            case 1:
                console.log( 'draw location info + destinations + all child location' );
                return new TabContent( this._generateLocationInfo(), this._generateCards() );
            case 2:
                console.log( 'draw location info + destinations' );
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
