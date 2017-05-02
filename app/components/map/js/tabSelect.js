"use strict";

import MediatorEvents from './enums/mediatorEvents';
import MediatorEventModel from './models/mediatorEventModel';

export default class TabSelect {
    constructor() {
        this._elem = document.querySelector( '.js-tabs' );
        this._tabs = {};
        this._currentTabName = '';
        this._btnHideDetails = this._elem.querySelector('.js-hide-details');
    }

    init() {
        let tabNodes = document.querySelectorAll( '.js-tabs-nav > .js-tab' );

        tabNodes.forEach( ( tabNode ) => {
            let tabName = tabNode.getAttribute( 'data-name' );

            this._tabs[ tabName ] = {
                tabNode: tabNode,
                contentNode: document.querySelector( '.js-tabs .js-content[data-name=' + tabName + ']'),
                detailsNode: document.querySelector( '.js-tabs .js-details')
            };

            tabNode.addEventListener( 'click', event => this._clickHandler(event) );
        });

        if ( this._btnHideDetails ) {
            this._btnHideDetails.addEventListener(
                'click',
                event => this._onClickBtnHideDetailsHandler(event)
            );
        }

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
            currentTab.contentNode.append( tabContent.additionalInfo );
        }

        if ( tabContent.cardList ) {
            tabContent.cardList.forEach( card => {
                currentTab.contentNode.append( card );
            });
        }

        if ( tabContent.detailsCard ) {
            this._clearDetailsTab();
            currentTab.detailsNode.append( tabContent.detailsCard );
            this._elem.classList.add('is-details-visible');
            //currentTab.detailsNode.classList.add('is-active');
        } else {
            //currentTab.detailsNode.classList.remove('is-active');
            this._elem.classList.remove('is-details-visible');
        }
    }

    _clickHandler( event ) {
        let tabName = event.target.getAttribute( 'data-name' );
        this.setActiveTab( tabName );

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.tabChanged;
        this._mediator.stateChanged( mediatorEvent );
    }

    _clearDetailsTab() {
        this._tabs[ this._currentTabName ].detailsNode.innerHTML = '';
    }

    _onClickBtnHideDetailsHandler() {
        this._elem.classList.remove('is-details-visible');

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.hideDetails;
        this._mediator.stateChanged( mediatorEvent );
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
