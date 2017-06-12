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
            zoom: 4
        });
    }

    addMarker( pin ) {
        pin.gmarker = new google.maps.Marker( {
            map: this.map,
            position: {
                lat: pin.lat || 0,
                lng: pin.lng || 0
            }
        } )
    }

}


