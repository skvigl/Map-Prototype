import AbstractLevelStrategy from './abstractLevelStrategy';
import TabNames from '../enums/tabNames';

export default class ZeroLevelStrategy extends AbstractLevelStrategy {
    getTabs() {
        return [ TabNames.overview ];
    }
}
