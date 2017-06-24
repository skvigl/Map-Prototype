"use strict";

import {config} from '../../config';
import AbstractTabStrategy from './abstractTabStrategy';
import LevelNames from '../../enums/levelNames';
import PinNames from '../../enums/pinNames';
import HolidayTypeNames from '../../enums/holidayTypeNames';
import TabContent from '../tabContent';

export default class MobileOverviewTabStrategy extends AbstractTabStrategy {
    constructor( name ) {
        super( [], name );
    }

    updatePinStrategies() {
        let currentLevel = config.levels.currentLevel,
            currentHolidayType = config.currentHolidayType,
            allowedPinStrategies = [
                PinNames.airport,
                PinNames.destination
            ];

        if ( ( currentHolidayType === HolidayTypeNames.city && currentLevel.name === LevelNames.country ) || currentLevel.name === LevelNames.district ) {
            allowedPinStrategies.push( PinNames.poi, PinNames.hotel );
        }

        this._pinStrategies = allowedPinStratagies;
    }

    generateContent() {
        switch ( config.levels.currentLevel.name ) {
            case LevelNames.world:
            case LevelNames.country:
            case LevelNames.district:
            case LevelNames.resort:
                return new TabContent( this._generateLocationInfo(), null );
        }
    }

    hasDetails() {
        return false;
    }
}
