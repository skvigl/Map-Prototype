'use strict';

import Config from '../config';
import MobileZeroLevelStrategy from './mobileZeroLevelStrategy';
import MobileNestedLevelStrategy from './mobileNestedLevelStrategy';
import ZeroLevelStrategy from './ZeroLevelStrategy';
import NestedLevelStrategy from './NestedLevelStrategy';

export default class LevelsFactory {
    constructor() {
    }

    static getLevelStrategies( level ) {

        if ( Config.instance.isMobile ) {
            switch ( level ) {
                case 0:
                    return new MobileZeroLevelStrategy();
                case 1:
                case 2:
                case 3:
                    return new MobileNestedLevelStrategy();
            }
        } else {
            switch ( level ) {
                case 0:
                    return new ZeroLevelStrategy();
                case 1:
                case 2:
                case 3:
                    return new NestedLevelStrategy();
            }
        }
    }
}
