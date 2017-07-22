import { config } from '../config';
import LevelNames from '../enums/levelNames';
import MobileZeroLevelStrategy from './mobileZeroLevelStrategy';
import MobileNestedLevelStrategy from './mobileNestedLevelStrategy';
import ZeroLevelStrategy from './ZeroLevelStrategy';
import NestedLevelStrategy from './NestedLevelStrategy';

export default class LevelsFactory {
    static getLevelStrategy( levelName ) {
        if ( config.maps.isMobile ) {
            switch ( levelName ) {
                case LevelNames.world:
                    return new MobileZeroLevelStrategy();
                case LevelNames.country:
                case LevelNames.district:
                case LevelNames.resort:
                    return new MobileNestedLevelStrategy();
                default:
                    throw new Error(`Unsupported level name: ${levelName}`);
            }
        } else {
            switch ( levelName ) {
                case LevelNames.world:
                    return new ZeroLevelStrategy();
                case LevelNames.country:
                case LevelNames.district:
                case LevelNames.resort:
                    return new NestedLevelStrategy();
                default:
                    throw new Error(`Unsupported level name: ${levelName}`);
            }
        }
    }
}
