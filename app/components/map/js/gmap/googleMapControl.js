/* globals google, RichMarker */

import BaseComponent from 'generic/baseComponent';

export default class GoogleMap extends BaseComponent {
    constructor() {
        super( 'gmap' );
        this.map = null;
    }

    init() {
        this.map = new google.maps.Map( this.rootNode, {
            center: {
                lat: 47.7,
                lng: 5.4
            },
            zoom: 4,
            disableDefaultUI: true,
            zoomControl: true
        } );
    }

    addMarker( pin ) {
        pin.richMarker = new RichMarker( {
            map: this.map,
            position: new google.maps.LatLng( pin.lat || 0, pin.lng || 0 ),
            content: pin.marker,
            flat: true,
            // RichMarkerPosition.MIDDLE
            anchor: 5
        } );
    }

    removeMarker( pin ) {
        if ( !pin.richMarker ) return;

        pin.richMarker.setMap( null );
    }

    setOptions( options ) {
        this.map.setOptions( options );
    }

    setCenter( position ) {
        this.map.setCenter( position );
    }
}
