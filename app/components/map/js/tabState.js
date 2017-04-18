"use strict";

export default class TabState{
    constructor(){
        this.currentPage = 0;
        this.totalPages = 0;
        this.hasPins = false;
    }

    static get isLoadMoreAvailable(){
        return this.currentPage < this.totalPage;
    }
}
