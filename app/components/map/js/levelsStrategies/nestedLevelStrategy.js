"use strict";

import AbstractLevelStrategy from './abstractLevelStrategy';
import TabsFactory from '../tabsStrategies/tabsFactory';
import TabNames from '../enums/tabNames';

export default class NestedLevelStrategy extends AbstractLevelStrategy {
    constructor( level ) {
        super();
        this._level = level;
    }

    getTabs() {
        return {
            [ TabNames.overview ]: TabsFactory.getTabStrategy( TabNames.overview, this._level ),
            [ TabNames.pois ]: TabsFactory.getTabStrategy( TabNames.pois ),
            [ TabNames.hotels ]: TabsFactory.getTabStrategy( TabNames.hotels )
        }
    }
}
