'use strict';

export default class BaseComponent {
    constructor( name ) {
        this.name = name;
        this.rootNode = document.querySelector('[data-component=' + this.name + ']');
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

    //private methods =/ ??
    findElements( selector ) {
        return Array.prototype.slice.call( this.rootNode.querySelectorAll('data-' + this.prefix + '-elem=' + name ) );
    }
}
