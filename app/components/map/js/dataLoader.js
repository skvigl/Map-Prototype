"use strict";

import axios from 'axios';

export default class DataLoader {
    constructor() {
    }

    getConfig() {
        //if we need to download special state from server
    }

    getPins( type, levelId ) {

        //just for example purpose
        let url = '/app/data/getPins' + type + levelId + '.json';

        return axios( {
            url,
            data: {
                type,
                levelId
            }
        });
    }

    getPinsByPage( type, page ) {

        //just for example purpose
        let url = '/app/data/getPinsByPage' + type + page + '.json';

        return axios( {
            url,
            data: {
                type,
                page
            }
        });
    }

    getPinDetails( idList, type ) {

        //just for example purpose
        let url = '/app/data/getPinDetails' + type + '.json';

        return axios( {
            url,
            data: {
                idList,
                type
            }
        });
    }

    getPinsMultithread( requests, callback ){
        axios.all(requests).then(axios.spread(callback));
    }
}
