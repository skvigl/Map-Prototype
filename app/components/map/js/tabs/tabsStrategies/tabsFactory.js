import { config } from '../../config';
import TabNames from '../../enums/tabNames';
import MobileOverviewTabStrategy from './mobileOverviewTabStrategy';
import OverviewTabStrategy from './overviewTabStrategy';
import PoiTabStrategy from './poiTabStrategy';
import HotelTabStrategy from './hotelTabStrategy';
import VillaTabStrategy from './villaTabStrategy';

export default class TabsFactory {
    static getTabStrategy( tabName ) {
        switch ( tabName ) {
            case TabNames.overview:
                if ( config.maps.isMobile ) {
                    return new MobileOverviewTabStrategy(
                        TabNames.overview
                    );
                }

                return new OverviewTabStrategy(
                    TabNames.overview
                );
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
            default:
                throw new Error(`Unsupported tab name: ${tabName}`);
        }
    }
}
