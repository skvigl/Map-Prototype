"use strict";

import MediatorEvents from './enums/mediatorEvents';

export default class TabSelect {
    constructor() {
        this._elem = document.querySelector( '.js-tabs' );
        this._tabs = {};
        this._currentTabName = '';
    }

    init() {
        let tabNodes = document.querySelectorAll( '.js-tabs-nav > .js-tab' );

        tabNodes.forEach( ( tabNode ) => {
            let tabName = tabNode.getAttribute( 'data-name' );

            this._tabs[ tabName ] = {
                tabNode: tabNode,
                contentNode: document.querySelector( '.js-tabs > .js-content[data-name=' + tabName + ']')
            };

            tabNode.addEventListener( 'click', event => this._clickHandler(event) );
        });

        console.log( this );
    }

    getCurrentTabName() {
        return this._currentTabName;
    }

    setMediator( mediator ) {
        this._mediator = mediator;
    }


    // clear( tabName ) {
    //     let clearingTab = this._tabs[tabName];
    //     clearingTab.contentElem.innerHTML = '';
    // }

    // update() {
    //     this._currentTabName = Config.instance.currentTab.getName();
    //     this._updateTabNavigation();
    //     this._clearTabsContent();
    //     this._setActiveTab();
    //     this._updateTabContent();
    // }

    setActiveTab( tabName ) {
        let oldTab = this._tabs[ this._currentTabName ];

        if ( oldTab ) {
            oldTab.tabNode.classList.remove('is-active');
            oldTab.contentNode.classList.remove('is-active');
        }

        let currentTab = this._tabs[ tabName ];

        if ( currentTab ) {
            currentTab.tabNode.classList.add('is-active');
            currentTab.contentNode.classList.add('is-active');
        }

        this._currentTabName = tabName;
    }

    setTabsVisibility( tabList ) {

        for( let tabName in this._tabs ) {

            if ( !this._tabs.hasOwnProperty( tabName ) ) {
                continue;
            }

            if ( tabList.indexOf( tabName ) === -1 ) {
                this._tabs[ tabName ].tabNode.classList.add('is-hidden');
            } else {
                this._tabs[ tabName ].tabNode.classList.remove('is-hidden');
            }
        }
    }

    // updateContent() {
    //     if ( this._tabs[ this._currentTabName ].currentPage === 0 ) {
    //         this._updateTabContent();
    //     }
    // }

    clearTabsContent() {
        for( let tab in this._tabs ) {
            if ( this._tabs.hasOwnProperty(tab) ) {
                this._tabs[tab].contentNode.innerHTML = '';
            }
        }
    }

    updateTabContent( tabContent ) {
        let currentTab = this._tabs[ this._currentTabName ];

        if ( tabContent.additionalInfo ) {
            console.log('tabContent.additionalInfo ', tabContent.additionalInfo);
        }

        if ( tabContent.cardList ) {
            tabContent.cardList.forEach( card => {
                currentTab.contentNode.append( card );
            });
        }
    }

    _clickHandler( event ) {
        let tabName = event.target.getAttribute( 'data-name' );
        this.setActiveTab( tabName );
        this._mediator.stateChanged( MediatorEvents.tabChanged );
    }

    // _updateTabNavigation() {
    //     let currentLevel = Config.instance.currentLevel;
    //
    //     for( let tab in this._tabs ) {
    //
    //         if ( this._tabs.hasOwnProperty(tab) ) {
    //
    //             if ( currentLevel.tabs.indexOf(tab) === -1 ) {
    //                 this._tabs[tab].tabNode.classList.add('is-hidden');
    //             } else {
    //                 this._tabs[tab].tabNode.classList.remove('is-hidden');
    //             }
    //         }
    //     }
    // }



    _drawContent() {

   }

    get getCurrentTab () {
        return this._tabs[ this._currentTabName ];
    }
}
