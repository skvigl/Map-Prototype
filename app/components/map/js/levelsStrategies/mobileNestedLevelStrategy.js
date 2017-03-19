"use strict";

import AbstractLevelStrategy from './abstractLevelStrategy';
import TabNames from '../enums/tabNames';

export default class MobileNestedLevelStrategy extends AbstractLevelStrategy {
    constructor() {
        super();
    }

    getTabs() {
        return [
            TabNames.overview,
            TabNames.pois,
            TabNames.hotels
        ]
    }
}
