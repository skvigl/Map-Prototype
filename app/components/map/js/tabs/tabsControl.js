import BaseComponent from 'generic/baseComponent';
import MediatorEvents from '../enums/mediatorEvents';
import MediatorEventModel from '../models/mediatorEventModel';

export default class TabsControl extends BaseComponent {
    constructor() {
        super( 'map-tabs' );
        this.prefix = 'mt';

        this._tabs = {};
        this._detailsNode = null;
        this._mediator = null;
        this._currentTabName = '';

        this.init();
    }

    init() {
        let navItemNodes = this.rootNode.querySelectorAll( '[data-mt-elem=nav-list] > [data-mt-elem=nav-item]' );
        navItemNodes = Array.prototype.slice.call( navItemNodes );

        navItemNodes.forEach( ( navItemNode ) => {
            const tabName = navItemNode.getAttribute( 'data-mt-name' ),
                tabNode = this.rootNode.querySelector( `[data-mt-elem=tab-item][data-mt-name=${tabName}]` );

            this._tabs[tabName] = {
                tabNavNode: navItemNode,
                tabNode,
                contentNode: tabNode.querySelector( '[data-mt-elem=tab-container][data-mt-name=content]' ),
                loadmoreNode: tabNode.querySelector( '[data-mt-elem=tab-container][data-mt-name=loadmore]' )
            };
        } );

        this._detailsNode = this.rootNode.querySelector( '[data-mt-elem=tab-details]' );
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
        const target = this._findElemNode( event.target, this.rootNode, elemName );

        if ( !target ) return;

        const tabName = target.getAttribute( `data-${this.prefix}-name` );

        if ( this._currentTabName === tabName ) return;

        this.setActiveTab( tabName );

        const mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.tabChanged;
        this._mediator.stateChanged( mediatorEvent );
    }

    _onClickBtnLoadmoreHandler( event, elemName ) {
        const target = this._findElemNode( event.target, this.rootNode, elemName );

        if ( !target ) return;

        const mediatorEvent = new MediatorEventModel();
        mediatorEvent.eventType = MediatorEvents.loadmorePinsDetails;
        this._mediator.stateChanged( mediatorEvent );
    }

    _onClickBtnHideDetailsHandler( event, elemName ) {
        const target = this._findElemNode( event.target, this.rootNode, elemName );

        if ( !target ) return;

        this.rootNode.classList.remove( 'is-details-visible' );

        const mediatorEvent = new MediatorEventModel();
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
        const oldTab = this._tabs[this._currentTabName];

        if ( oldTab ) {
            oldTab.tabNavNode.classList.remove( 'is-active' );
            oldTab.tabNode.classList.remove( 'is-active' );
        }

        const currentTab = this._tabs[tabName];

        if ( currentTab ) {
            currentTab.tabNavNode.classList.add( 'is-active' );
            currentTab.tabNode.classList.add( 'is-active' );
        }

        this._currentTabName = tabName;
    }

    setTabsVisibility( tabList ) {
        Object.keys( this._tabs ).forEach( ( tabName ) => {
            if ( tabList.indexOf( tabName ) === -1 ) {
                this._tabs[tabName].tabNavNode.classList.add( 'is-hidden' );
            } else {
                this._tabs[tabName].tabNavNode.classList.remove( 'is-hidden' );
            }
        } );
    }

    clearTabsContent() {
        Object.keys( this._tabs ).forEach( ( tabName ) => {
            this._tabs[tabName].contentNode.innerHTML = '';
        });
    }

    updateTabContent( tabContent ) {
        const currentTab = this._tabs[this._currentTabName];

        if ( tabContent.additionalInfo ) {
            currentTab.contentNode.appendChild( tabContent.additionalInfo );
        }

        if ( tabContent.cardList ) {
            tabContent.cardList.forEach( ( card ) => {
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
        const currentTab = this._tabs[this._currentTabName];

        if ( isVisible ) {
            currentTab.loadmoreNode.classList.add( 'is-visible' );
        } else {
            currentTab.loadmoreNode.classList.remove( 'is-visible' );
        }
    }
}
