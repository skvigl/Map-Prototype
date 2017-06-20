"use strict";

import BaseComponent from 'generic/baseComponent';
import MediatorEvents from '../enums/mediatorEvents';
import MediatorEventModel from '../models/mediatorEventModel';

export default class TabsControl extends BaseComponent {
    constructor() {
        super( 'map-tabs' );
        this.prefix = 'mt';
        //this._elem = document.querySelector( '.js-tabs' );
        this._tabs = {};
        this._currentTabName = '';

        this._mediator = null;


        this.init();
        console.log( this );
    }

    init() {

        let navItemNodes = this.rootNode.querySelectorAll( '[data-mt-elem=nav-list] > [data-mt-elem=nav-item]' );
        navItemNodes = Array.prototype.slice.call( navItemNodes );

        navItemNodes.forEach( ( navItemNode ) => {
            let tabName = navItemNode.getAttribute( 'data-mt-name' ),
                tabNode = this.rootNode.querySelector(' [data-mt-elem=tab-item][data-mt-name=' + tabName + ']');
            //querySelector( '.js-tab[data-name=' + tabName + ']' );

            this._tabs[tabName] = {
                tabNavNode: navItemNode,
                tabNode: tabNode,
                contentNode: tabNode.querySelector( '[data-mt-elem=tab-container][data-mt-name=content]' ),
                loadmoreNode: tabNode.querySelector( '[data-mt-elem=tab-container][data-mt-name=loadmore]' ),
                detailsNode: this.rootNode.querySelector( '[data-mt-elem=tab-details]' )
            };

            navItemNode.addEventListener( 'click', event => this._clickHandler( event ) );

            //TODO: refactoring this with delegate
            if ( this._tabs[tabName].loadmoreNode ) {
                this._tabs[tabName].loadmoreNode.addEventListener( 'click', event => this._onClickLoadmoreHandler( event ) );
            }

        } );

        this._btnHideDetails = this.rootNode.querySelector( '[data-mt-elem=hide-details]' );

        if ( this._btnHideDetails ) {
            this._btnHideDetails.addEventListener(
                'click',
                event => this._onClickBtnHideDetailsHandler( event )
            );
        }

        //console.log( this );
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
    //     this._currentTabName = config.currentTab.getName();
    //     this._updateTabNavigation();
    //     this._clearTabsContent();
    //     this._setActiveTab();
    //     this._updateTabContent();
    // }

    setActiveTab( tabName ) {
        let oldTab = this._tabs[this._currentTabName];

        if ( oldTab ) {
            oldTab.tabNavNode.classList.remove( 'is-active' );
            oldTab.tabNode.classList.remove( 'is-active' );
        }

        let currentTab = this._tabs[tabName];

        if ( currentTab ) {
            currentTab.tabNavNode.classList.add( 'is-active' );
            currentTab.tabNode.classList.add( 'is-active' );
        }

        this._currentTabName = tabName;
    }

    setTabsVisibility( tabList ) {

        for ( let tabName in this._tabs ) {

            if ( !this._tabs.hasOwnProperty( tabName ) ) {
                continue;
            }

            if ( tabList.indexOf( tabName ) === -1 ) {
                this._tabs[tabName].tabNavNode.classList.add( 'is-hidden' );
            } else {
                this._tabs[tabName].tabNavNode.classList.remove( 'is-hidden' );
            }
        }
    }

    clearTabsContent() {
        for ( let tab in this._tabs ) {
            if ( this._tabs.hasOwnProperty( tab ) ) {
                this._tabs[tab].contentNode.innerHTML = '';
            }
        }
    }

    updateTabContent( tabContent ) {
        let currentTab = this._tabs[this._currentTabName];

        if ( tabContent.additionalInfo ) {
            currentTab.contentNode.appendChild( tabContent.additionalInfo );
        }

        if ( tabContent.cardList ) {
            tabContent.cardList.forEach( card => {
                currentTab.contentNode.appendChild( card );
            } );
        }

        if ( tabContent.detailsCard ) {
            this._clearDetailsTab();
            currentTab.detailsNode.appendChild( tabContent.detailsCard );
            this.rootNode.classList.add( 'is-details-visible' );
            //currentTab.detailsNode.classList.add('is-active');
        } else {
            //currentTab.detailsNode.classList.remove('is-active');
            this.rootNode.classList.remove( 'is-details-visible' );
        }
    }

    _clickHandler( event ) {
        let tabName = event.target.getAttribute( 'data-mt-name' );
        this.setActiveTab( tabName );

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.tabChanged;
        this._mediator.stateChanged( mediatorEvent );
    }

    _clearDetailsTab() {
        this._tabs[this._currentTabName].detailsNode.innerHTML = '';
    }

    _onClickBtnHideDetailsHandler() {
        this.rootNode.classList.remove( 'is-details-visible' );

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.hideDetails;
        this._mediator.stateChanged( mediatorEvent );
    }

    _onClickLoadmoreHandler() {
        console.log( 'click' );
        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.loadmorePinsDetails;
        this._mediator.stateChanged( mediatorEvent );
    }

    setLoadmoreVisibility( isVisible ) {

        //TODO: think about code style for IF operator
        if ( isVisible ) {
            this._tabs[this._currentTabName].loadmoreNode.classList.add( 'is-visible' );
        } else {
            this._tabs[this._currentTabName].loadmoreNode.classList.remove( 'is-visible' );
        }
    }

    get getCurrentTab() {
        return this._tabs[this._currentTabName];
    }
}
