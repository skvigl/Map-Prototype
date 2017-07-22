import AbstractLevelStrategy from './abstractLevelStrategy';
import TabNames from '../enums/tabNames';

export default class mobileZeroLevelStrategy extends AbstractLevelStrategy {
    getTabs() {
        return [ TabNames.overview ];
    }
}
