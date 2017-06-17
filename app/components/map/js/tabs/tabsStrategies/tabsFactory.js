'use strict';

import { config } from '../../config';
import TabNames from '../../enums/tabNames';
import MobileOverviewTabStrategy from './mobileOverviewTabStrategy';
import OverviewTabStrategy from './overviewTabStrategy';
import PoiTabStrategy from './poiTabStrategy';
import HotelTabStrategy from './hotelTabStrategy';
import VillaTabStrategy from './villaTabStrategy';

export default class TabsFactory {
    constructor() {
    }

    static getTabStrategy( name ) {

        switch ( name ) {
            case TabNames.overview:
                if ( config.maps.isMobile ) {
                    return new MobileOverviewTabStrategy(
                        TabNames.overview
                    );
                } else {
                    return new OverviewTabStrategy(
                        TabNames.overview
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
            case TabNames.villas:
                return new VillaTabStrategy(
                    TabNames.villas
                );
        }
    }
}










