"use strict";

import AbstractLevelStrategy from './abstractLevelStrategy';
import TabNames from '../enums/tabNames';

export default class NestedLevelStrategy extends AbstractLevelStrategy {
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
