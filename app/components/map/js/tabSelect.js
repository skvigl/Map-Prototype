"use strict";

import Config from './config';
import Tab from './tab';

export default class TabSelect {
    constructor() {
        this._elem = document.querySelector( '.js-tabs' );
        this._tabs = {};
    }

    init() {
        let tabNodes = document.querySelectorAll( '.js-tabs-nav > .js-tab' );

        tabNodes.forEach( ( tab ) => {
            let tabName = tab.getAttribute( 'data-name' );

            this._tabs[tabName] = new Tab(
                tab,
                document.querySelector( '.js-tabs > .js-content[data-name=' + tabName + ']')
            );

            tab.addEventListener( 'click', event => this._clickHandler(event) );
        });

        this._currentTab = Config.instance.currentTab.getName();
        this.update();
    }

    changeHadler() {
        this._mediator.stateChanged( this );
    }

    getCurrentTab() {
        return this._currentTab;
    }


    // clear( tabName ) {
    //     let clearingTab = this._tabs[tabName];
    //     clearingTab.contentElem.innerHTML = '';
    // }

    setMediator( mediator ) {
        this._mediator = mediator;
    }

    update() {
        this._updateTabNavigation();
        this._updateTabContent();
    }

    _clickHandler( event ) {
        console.log('click tab');
        this._tabs[ this._currentTab ].tabElem.classList.remove('is-active');
        this._tabs[ this._currentTab ].contentElem.classList.remove('is-active');
        this._currentTab = event.target.getAttribute( 'data-name' );
        this._tabs[ this._currentTab ].tabElem.classList.add( 'is-active' );
        this._tabs[ this._currentTab ].contentElem.classList.add( 'is-active' );
        this._mediator.stateChanged( this );
    }

    _updateTabNavigation() {
        let currentLevel = Config.instance.currentLevel;

        for( let tab in this._tabs ) {

            if ( this._tabs.hasOwnProperty(tab) ) {

                if ( currentLevel.tabs[tab] === undefined ) {
                    this._tabs[tab].tabElem.classList.add('is-hidden');
                } else {
                    this._tabs[tab].tabElem.classList.remove('is-hidden');
                }
            }
        }
    }

    _updateTabContent() {
        let currentLevel = Config.instance.currentLevel;
        let currentTabStrategy = currentLevel.tabs[Config.instance.currentTab];

        //this._drawContent( currentTabStrategy.generateContent( currentLevel.levelId ) );
    }

    _drawContent() {
        // if ( this._tabs[this._currentTab].currentPage === 0 ) {
        //     Config.instance.currentLevel
        //         .tabs[Config.instance.currentTab]
        //         .generateContent( Config.instance.currentLevel.levelId );
        // }
        //this._tabs[this._currentTab].contentElem.innerHTML = content;
    }
}
