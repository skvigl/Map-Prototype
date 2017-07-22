import { config } from '../config';
import AbstractPinStrategy from './abstractPinStrategy';
import LevelNames from '../enums/levelNames';
import PinNames from '../enums/pinNames';
import MarkerTemplate from '../../templates/marker.hbs';
import GenerateContentModel from '../models/generateContentModel';
import MediatorEvents from '../enums/mediatorEvents';
import MediatorEventModel from '../models/mediatorEventModel';

export default class AirportPinStrategy extends AbstractPinStrategy {
    generateMultiplePins( pinsArray ) {
        return super.generateMultiplePins( pinsArray, PinNames.airport );
    }

    generateMultipleContent() {
        return null;
    }

    onPinClick( pin ) {
        if ( config.levels.currentLevel.name === LevelNames.world ) {
            const activePin = config.pins.activePin;

            if ( activePin && activePin.marker ) {
                activePin.marker.classList.remove( 'is-active' );
            }

            if ( pin && pin.marker ) {
                pin.marker.classList.add( 'is-active' );
            }

            const mediatorEvent = new MediatorEventModel();
            mediatorEvent.eventType = MediatorEvents.filterPins;
            mediatorEvent.airportId = pin.id;
            mediatorEvent.targetPin = pin;
            config.mediator.stateChanged( mediatorEvent );
        }
    }

    _generatePin( pin ) {
        pin.markerModifiers = 'marker--airport';

        const params = new GenerateContentModel();
        params.pin = pin;
        params.key = 'marker';
        params.template = MarkerTemplate;

        super._generateContent( params );
        return pin;
    }
}
