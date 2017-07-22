import { config } from '../../config';
import AbstractTabStrategy from './abstractTabStrategy';
import LevelNames from '../../enums/levelNames';
import PinNames from '../../enums/pinNames';
import TabContent from '../tabContent';

export default class OverviewTabStrategy extends AbstractTabStrategy {
    constructor( name ) {
        super( [], name );
    }

    updatePinStrategies() {
        let allowedPinStratagies = [];

        switch ( config.levels.currentLevel.name ) {
            case LevelNames.world:
                allowedPinStratagies = [
                    PinNames.airport,
                    PinNames.destination,
                ];
                break;
            case LevelNames.country:
                allowedPinStratagies = [
                    PinNames.airport,
                    PinNames.destination,
                    PinNames.childDestination,
                ];
                break;
            case LevelNames.district:
                allowedPinStratagies = [
                    PinNames.airport,
                    PinNames.destination,
                ];
                break;
            case LevelNames.resort:
                allowedPinStratagies = [
                    PinNames.airport,
                    PinNames.poi,
                    PinNames.hotel
                ];
                break;
            default:
                throw new Error(`Unsupported level name: ${config.levels.currentLevel.name}`);
        }

        this._pinStrategies = allowedPinStratagies;
    }

    generateContent() {
        switch ( config.levels.currentLevel.name ) {
            case LevelNames.world:
                return new TabContent( null, this._generateCards() );
            case LevelNames.country:
                return new TabContent( this._generateLocationInfo(), this._generateCards() );
            case LevelNames.district:
                return new TabContent( this._generateLocationInfo(), this._generateCards() );
            case LevelNames.resort:
                return new TabContent( this._generateLocationInfo(), null );
            default:
                throw new Error(`Unsupported level name: ${config.levels.currentLevel.name}`);
        }
    }

    hasDetails() {
        return false;
    }

    _generateLocationInfo() {
        return config.pins.strategies[PinNames.destination].generateLocationInfo();
    }
}
