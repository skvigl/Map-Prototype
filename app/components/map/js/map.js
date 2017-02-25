'use strict';

import Config from './config';
import PinNames from './enums/pinNames';
import LevelsFactory from './levelsStrategies/levelsFactory';
import Mediator from 'mediator';
import LevelSelect from './levelSelect';
import TabSelect from 'tabSelect';


export default class Map {
    constructor() {
    }

    init() {

        Config.instance.map = document.querySelector('.js-map');
        Config.instance.levelSelect = new LevelSelect();
        Config.instance.tabSelect = new TabSelect();
        Config.instance.mediator = new Mediator();
        Config.instance.pinsArray = this._getMarkers();

        Config.instance.levelCollections.forEach( ( level ) => {
            level.strategy = LevelsFactory.getLevelStrategies( level.levelId );
            level.tabs = level.strategy.getTabs();
        });

        this.initMapAtLevel( 0, 'overview' );

        Config.instance.levelSelect.init();
        Config.instance.tabSelect.init();

        Config.instance.mediator.addInitiator( 'levelSelect', Config.instance.levelSelect );
        Config.instance.mediator.addInitiator( 'tabSelect' , Config.instance.tabSelect );
        Config.instance.mediator.addInitiator( 'map' , this );

        Config.instance.levelSelect.setMediator( Config.instance.mediator );
        Config.instance.tabSelect.setMediator( Config.instance.mediator );

        console.log( Config.instance );

        this.drawAllPins();
    }

    _getMarkers() {
        return [
            {type: PinNames.hotel, text: 'HOTEL1'},
            {type: PinNames.poi, text: 'POI1'},
            {type: PinNames.destination, text: 'Majorca'},
            {type: PinNames.destination, text: 'Chelyabinsk', holidayType: 'cityBreak'},
            {type: PinNames.poi, text: 'POI2'},
            {type: PinNames.airport, text: 'AIRPORT1'},
            {type: PinNames.airport, text: 'AIRPORT2'},
            {type: PinNames.airport, text: 'AIRPORT3'},
            {type: PinNames.hotel, text: 'HOTEL2'},
            {type: PinNames.hotel, text: 'HOTEL3'},
            {type: PinNames.hotel, text: 'HOTEL4'},
            {type: PinNames.hotel, text: 'HOTEL5'}
        ];
    }

    destroy() {

    }

    initMapAtLevel( level, tab ) {
        Config.instance.currentLevel = Config.instance.levelCollections[ level ];
        Config.instance.currentTab = Config.instance.currentLevel.tabs[ tab ];
    }

    drawAllPins() {
        Config.instance.map.innerHTML = '';
        Config.instance.currentTab
            .getPinStrategies()
            .forEach( ( strategy ) => {
                this._drawPins( strategy );
        });
    }

    _drawPins( strategy ) {
        let pins = strategy.generateMultiplePins( Config.instance.pinsArray );
        pins.forEach( pin => {
            Config.instance.map.append( pin );
        })
    }
}



