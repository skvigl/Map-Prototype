"use strict";

import axios from 'axios';


export default class AjaxHandler {
    constructor() {

    }

    getConfig() {

    }

    getPins( type, level ) {

        //just for example purpose
        let url = '/app/data/getPins' + type + level + '.json';

        return axios( {
            url,
            data: {
                type,
                level
            }
        });

    }

    getPinsByPage( type, page ) {

    }

    getPinDetails( idList ) {

    }
}
