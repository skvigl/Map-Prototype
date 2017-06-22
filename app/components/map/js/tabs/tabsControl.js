"use strict";

import BaseComponent from 'generic/baseComponent';
import MediatorEvents from '../enums/mediatorEvents';
import MediatorEventModel from '../models/mediatorEventModel';

export default class TabsControl extends BaseComponent {
    constructor() {
        super( 'map-tabs' );
        this.prefix = 'mt';

        this._tabs = {};
        this._detailsNode = null;
        this._btnHideDetails = null;
        this._mediator = null;
        this._currentTabName = '';

        this.init();
    }

    init() {
        let navItemNodes = this.rootNode.querySelectorAll( '[data-mt-elem=nav-list] > [data-mt-elem=nav-item]' );
        navItemNodes = Array.prototype.slice.call( navItemNodes );

        navItemNodes.forEach( ( navItemNode ) => {
            let tabName = navItemNode.getAttribute( 'data-mt-name' ),
                tabNode = this.rootNode.querySelector( ' [data-mt-elem=tab-item][data-mt-name=' + tabName + ']' );

            this._tabs[tabName] = {
                tabNavNode: navItemNode,
                tabNode: tabNode,
                contentNode: tabNode.querySelector( '[data-mt-elem=tab-container][data-mt-name=content]' ),
                loadmoreNode: tabNode.querySelector( '[data-mt-elem=tab-container][data-mt-name=loadmore]' )
            };
        } );

        this._detailsNode = this.rootNode.querySelector( '[data-mt-elem=tab-details]' );
        this._btnHideDetails = this.rootNode.querySelector( '[data-mt-elem=hide-details]' );

        this.addListeners();
    }

    addListeners() {

        this.rootNode.addEventListener(
            'click',
            this.listeners.onClickNavItemHandler = event => this._onClickNavItemHandler( event, 'nav-item' )
        );

        this.rootNode.addEventListener(
            'click',
            this.listeners.onClickBtnLoadmoreHandler = event => this._onClickBtnLoadmoreHandler( event, 'loadmore' )
        );

        this.rootNode.addEventListener(
            'click',
            this.listeners.onClickBtnHideDetailsHandler = event => this._onClickBtnHideDetailsHandler( event, 'hide-details' )
        );
    }

    _onClickNavItemHandler( event, elemName ) {
        let target = this._findElemNode( event.target, this.rootNode, elemName );

        if ( !target ) {
            return false;
        }

        let tabName = target.getAttribute( 'data-' + this.prefix + '-name' );

        if ( this._currentTabName === tabName ) {
            return false;
        }

        this.setActiveTab( tabName );

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.tabChanged;
        this._mediator.stateChanged( mediatorEvent );
    }

    _onClickBtnLoadmoreHandler( event, elemName ) {
        let target = this._findElemNode( event.target, this.rootNode, elemName );

        if ( !target ) {
            return false;
        }

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.loadmorePinsDetails;
        this._mediator.stateChanged( mediatorEvent );
    }

    _onClickBtnHideDetailsHandler( event, elemName ) {
        let target = this._findElemNode( event.target, this.rootNode, elemName );

        if ( !target ) {
            return false;
        }

        this.rootNode.classList.remove( 'is-details-visible' );

        let mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.hideDetails;
        this._mediator.stateChanged( mediatorEvent );
    }

    getCurrentTabName() {
        return this._currentTabName;
    }

    setMediator( mediator ) {
        this._mediator = mediator;
    }

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
            this._detailsNode.appendChild( tabContent.detailsCard );
            this.rootNode.classList.add( 'is-details-visible' );
        } else {
            this.rootNode.classList.remove( 'is-details-visible' );
        }
    }

    _clearDetailsTab() {
        this._detailsNode.innerHTML = '';
    }

    setLoadmoreVisibility( isVisible ) {
        let currentTab = this._tabs[this._currentTabName];

        if ( isVisible ) {
            currentTab.loadmoreNode.classList.add( 'is-visible' );
        } else {
            currentTab.loadmoreNode.classList.remove( 'is-visible' );
        }
    }

    static get getCurrentTab() {
        return this._tabs[this._currentTabName];
    }
}
