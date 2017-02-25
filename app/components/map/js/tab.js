"use strict";

export default class Tab {
    constructor( tabElem, contentElem ){
        this.tabElem = tabElem;
        this.contentElem = contentElem;
        this.currentPage = 0;
        this.strategy = {};
    }
}
