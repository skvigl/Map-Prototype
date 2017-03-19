'use strict';

import PinNames from '../enums/pinNames';
import HolidayTypeNames from '../enums/holidayTypeNames';
import DestinationPinStrategy from './destinationPinStrategy';
import AirportPinStrategy from './airportPinStrategy';
import PoiPinStrategy from './PoiPinStrategy';
import HotelPinStrategy from './HotelPinStrategy';

export default class PinFactory {
    constructor() {
    }

    static getPinStrategy( pinType, holidayType ) {
        switch ( pinType ) {
            case PinNames.airport:
                return new AirportPinStrategy();
            case PinNames.destination:
                if ( holidayType === undefined || holidayType === HolidayTypeNames.beach ) {
                    return new DestinationPinStrategy();
                } else if ( holidayType === HolidayTypeNames.city ) {
                    return new CityBreakPinStrategy();
                }
                break;
            case PinNames.poi:
                return new PoiPinStrategy();
            case PinNames.hotel:
                return new HotelPinStrategy();
        }
    }
}












