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

        this._currentTabName = Config.instance.currentTab.getName();
        this.update();
    }

    changeHadler() {
        this._mediator.stateChanged( this );
    }

    getCurrentTabName() {
        return this._currentTabName;
    }


    // clear( tabName ) {
    //     let clearingTab = this._tabs[tabName];
    //     clearingTab.contentElem.innerHTML = '';
    // }

    setMediator( mediator ) {
        this._mediator = mediator;
    }

    update() {
        this._currentTabName = Config.instance.currentTab.getName();
        this._updateTabNavigation();
        this._clearTabContent();
        this._setActiveTab();
        this._updateTabContent();
    }

    updateContent() {
        if ( this._tabs[ this._currentTabName ].currentPage === 0 ) {
            this._updateTabContent();
        }
    }

    _clickHandler( event ) {
        this._currentTabName = event.target.getAttribute( 'data-name' );
        this._setActiveTab();
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

    _clearTabContent() {
        this.getCurrentTab.currentPage = 0;
        this.getCurrentTab.contentElem.innerHTML = '';
    }

    _updateTabContent() {
        let currentTab = this.getCurrentTab;
        let tabContent = Config.instance.currentTab.generateContent();

        if ( tabContent.additionalInfo ) {
            console.log('tabContent.additionalInfo ', tabContent.additionalInfo);
        }

        if ( tabContent.cardList ) {
            //currentTab.contentElem.append( tabContent.cardList );
            //this._tabs[ Config.instance.currentTab.getName() ].

            tabContent.cardList.forEach( card => {
                currentTab.contentElem.append( card );
            });
        }

        currentTab.currentPage++;


        //this._drawContent( currentTabStrategy.generateContent( currentLevel.levelId ) );
    }

    _setActiveTab() {
        for( let tab in this._tabs ) {

            if ( this._tabs.hasOwnProperty(tab) ) {
                this._tabs[tab].tabElem.classList.remove('is-active');
                this._tabs[tab].contentElem.classList.remove('is-active');
            }
        }

        this.getCurrentTab.tabElem.classList.add('is-active');
        this.getCurrentTab.contentElem.classList.add('is-active');
    }

    _drawContent() {
        // if ( this._tabs[this._currentTabName].currentPage === 0 ) {
        //     Config.instance.currentLevel
        //         .tabs[Config.instance.currentTab]
        //         .generateContent( Config.instance.currentLevel.levelId );
        // }
        //this._tabs[this._currentTabName].contentElem.innerHTML = content;
   }

    get getCurrentTab () {
        return this._tabs[ this._currentTabName ];
    }
}
