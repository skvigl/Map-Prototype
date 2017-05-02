"use strict";

import Config from '../config';
import TabContent from '../tabContent';

export default class AbstractTabStrategy {
    constructor( pinStrategies, name ) {
        this._name = name;
        this._pinStrategies = pinStrategies;
    }

    getPinStrategies() {
        return this._pinStrategies;
    }

    getName() {
        return this._name;
    }

    updatePinStrategies() {}

    hasLoadMore(){
        return true;
    }

    hasDetails(){
        return true;
    }

    generateDetailsCard( pin ) {

        if ( !pin.detailsView ) {
            Config.instance.pinStrategies[ pin.type ].generateDetailsContent( pin );
        }

        return new TabContent( null, null , pin.detailsView );
    }

    getDetailsCard( pin ) {
        return new TabContent( null, null , pin.detailsView );
    }

    _generateCards( pins ) {
        let cards = [];

        this._pinStrategies.forEach( strategy => {
            let newContent = Config.instance.pinStrategies[ strategy ].generateMultipleContent( pins );

            if ( newContent ) {
                cards = cards.concat( newContent );
            }

        });

        return cards;
    }


}
