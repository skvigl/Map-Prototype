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
        let currentLevel = config.levels.currentLevel.id || 0,
            currentHolidayType = config.currentHolidayType,
            allowedPinStrategies = [
            PinNames.airport,
            PinNames.destination
        ];

        if ( ( currentHolidayType === HolidayTypeNames.city && currentLevel === 2 ) || currentLevel === 3 ) {
            allowedPinStrategies.push( PinNames.poi, PinNames.hotel );
        }

        this._pinStrategies = allowedPinStratagies;
    }

    generateContent() {
        switch ( config.levels.currentLevel.id ) {
            case 0:
            case 1:
            case 2:
            case 3:
                return new TabContent( this._generateLocationInfo(), null );
        }
    }

    hasDetails(){
        return false;
    }
}
