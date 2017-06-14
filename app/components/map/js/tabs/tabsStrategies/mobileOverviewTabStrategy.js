"use strict";

import { config } from '../../config';
import AbstractTabStrategy from './abstractTabStrategy';
import PinNames from '../../enums/pinNames';
import HolidayTypeNames from '../../enums/holidayTypeNames';
import TabContent from '../tabContent';

export default class MobileOverviewTabStrategy extends AbstractTabStrategy {
    constructor( name ) {
        super( [], name );
        this.updatePinStrategies();
    }

    updatePinStrategies() {
        let currentLevel = config.currentLevel.levelId || 0,
            currentHolidayType = config.currentHolidayType;
        let allowedPinStrategies = [
            PinNames.airport,
            PinNames.destination
        ];

        if ( ( currentHolidayType === HolidayTypeNames.city && currentLevel === 2 ) || currentLevel === 3 ) {
            allowedPinStrategies.push( PinNames.poi, PinNames.hotel );
        }

        this._pinStrategies = allowedPinStratagies;
    }

    generateContent() {
        switch ( config.currentLevel.levelId ) {
            case 0:
            case 1:
            case 2:
            case 3:
                console.log( 'draw location info' );
                return new TabContent( this._generateLocationInfo(), null );

        }
    }

    hasLoadMore(){
        return false;
    }

    hasDetails(){
        return false;
    }
}
