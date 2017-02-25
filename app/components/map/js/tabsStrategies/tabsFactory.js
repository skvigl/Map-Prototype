'use strict';

import Config from '../config';
import TabNames from '../enums/tabNames';
import MobileOverviewTabStrategy from './mobileOverviewTabStrategy';
import OverviewTabStrategy from './OverviewTabStrategy';
import PoiTabStrategy from './poiTabStrategy';
import HotelTabStrategy from './hotelTabStrategy';

export default class TabsFactory {
    constructor() {
    }

    static getTabStrategy( tab, level ) {

        switch ( tab ) {
            case TabNames.overview:
                if ( Config.instance.isMobile ) {
                    return new MobileOverviewTabStrategy(
                        TabNames.overview,
                        level,
                        Config.instance.isCityBreak
                    );
                } else {
                    return new OverviewTabStrategy(
                        TabNames.overview,
                        level
                    );
                }
            case TabNames.pois:
                return new PoiTabStrategy(
                    TabNames.pois
                );
            case TabNames.hotels:
                return new HotelTabStrategy(
                    TabNames.hotels
                );
        }
    }
}










