import PinNames from '../enums/pinNames';
import DestinationPinStrategy from './destinationPinStrategy';
import ChildDestinationPinStrategy from './childDestinationPinStrategy';
import AirportPinStrategy from './airportPinStrategy';
import PoiPinStrategy from './PoiPinStrategy';
import HotelPinStrategy from './HotelPinStrategy';

export default class PinFactory {
    static getPinStrategy( pinType ) {
        switch ( pinType ) {
            case PinNames.airport:
                return new AirportPinStrategy();
            case PinNames.destination:
                return new DestinationPinStrategy();
            case PinNames.childDestination:
                return new ChildDestinationPinStrategy();
            case PinNames.poi:
                return new PoiPinStrategy();
            case PinNames.hotel:
                return new HotelPinStrategy();
            default:
                throw new Error( `Unsupported pin type: ${pinType}` );
        }
    }
}
