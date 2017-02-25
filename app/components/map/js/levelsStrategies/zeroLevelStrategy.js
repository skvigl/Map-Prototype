"use strict";

import AbstractLevelStrategy from './abstractLevelStrategy';
import TabsFactory from '../tabsStrategies/tabsFactory';
import TabNames from '../enums/tabNames';

export default class ZeroLevelStrategy extends AbstractLevelStrategy {
    constructor() {
        super();
    }

    getTabs() {
        return {
            [ TabNames.overview ]: TabsFactory.getTabStrategy( TabNames.overview, 0 )
        }
    }
}
