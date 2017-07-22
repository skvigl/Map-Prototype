import AbstractLevelStrategy from './abstractLevelStrategy';
import TabNames from '../enums/tabNames';

export default class NestedLevelStrategy extends AbstractLevelStrategy {
    getTabs() {
        return [
            TabNames.overview,
            TabNames.pois,
            TabNames.hotels
        ];
    }
}
