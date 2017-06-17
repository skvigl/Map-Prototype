'use strict';

export default class GoogleMap {
    constructor(){
        this.map = null;
    }

    init() {
        this.map = new google.maps.Map( document.querySelector('.js-gmap'), {
            center: {
                lat: 47.7,
                lng: 5.4
            },
            zoom: 4,
            disableDefaultUI: true,
            zoomControl: true
        });

    }

    setOptions( options ) {
        this.map.setOptions(options);
    }

    addMarker( pin ) {
        pin.richMarker = new RichMarker({
            map: this.map,
            position: new google.maps.LatLng(pin.lat || 0, pin.lng || 0),
            content: pin.marker,
            flat: true,
            anchor: RichMarkerPosition.MIDDLE
        });
    }

    removeMarker( pin ) {
        pin.richMarker.setMap( null );
    }

    setCenter( position ) {
        this.map.setCenter( position );
    }
}


