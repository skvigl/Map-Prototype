import axios from 'axios';

export default class DataLoader {
    getConfig() {
        //  if we need to download special state from server
    }

    getPins( type, levelName ) {
        //  just for example purpose
        const url = `/app/data/getPins${type}${levelName}.json`;

        return axios( {
            url,
            data: {
                type,
                levelName
            }
        } );
    }

    getPinsByPage( type, page ) {
        //  just for example purpose
        const url = `/app/data/getPinsByPage${type}${page}.json`;

        return axios( {
            url,
            data: {
                type,
                page
            }
        } );
    }

    getPinDetails( idList, type ) {
        //  just for example purpose
        const url = `/app/data/getPinDetails${type}.json`;

        return axios( {
            url,
            data: {
                idList,
                type
            }
        } );
    }

    getPinsMultithread( requests, callback ) {
        axios.all( requests ).then( axios.spread( callback ) );
    }
}
