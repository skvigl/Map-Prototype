"use strict";

import AbstractLevelStrategy from './abstractLevelStrategy';
import TabNames from '../enums/tabNames';

export default class mobileZeroLevelStrategy extends AbstractLevelStrategy {
    constructor() {
        super();
    }

    getTabs() {
        return [ TabNames.overview ]
    }
}
