export default class BaseComponent {
    constructor( name ) {
        this.name = name;
        this.rootNode = document.querySelector(`[data-component=${this.name}]`);
        this.prefix = '';
        this.settings = {};
        this.listeners = {};
    }

    init() {
    }

    destroy() {
    }

    setVariables() {
    }

    checkElements() {
    }

    addListeners() {
    }

    removeListeners() {
    }

    _findElemNode( currentNode, rootNode, elemName ) {
        while ( currentNode && currentNode !== rootNode ) {
            if ( currentNode.getAttribute(`data-${this.prefix}-elem`) === elemName ) {
                return currentNode;
            }

            currentNode = currentNode.parentNode;
        }

        return null;
    }
}
