"use strict";

import AbstractLevelStrategy from './abstractLevelStrategy';
import TabNames from '../enums/tabNames';

export default class ZeroLevelStrategy extends AbstractLevelStrategy {
    constructor() {
        super();
    }

    getTabs() {
        return [ TabNames.overview ]
    }
}
