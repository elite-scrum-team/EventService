const fetch = require('node-fetch');
const querystring = require('querystring');

/**
 Service
 @module util/service
 */

module.exports = {
    fetch: {
        /**
         *  @function
         *  @param {string} serviceName - Name of the service
         *  @param {string} path - path of the fetch
         *  @param {string} query - query of the fetch
         *  @param {Object} body - body of the fetch
         *  @return A promise of a fetch
         */
        async post(serviceName, path, query, body) {
            let url = `http://${
                process.env[serviceName.toUpperCase() + '_SERVICE_SERVICE_HOST']
                }/api/v1/${path}`;
            const qs = querystring.stringify(query);
            if (qs) url += `?${qs}`;
            if(!path)return null;
            return await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
        },
        /**
         *  @function
         *  @param {string} serviceName - Name of the service
         *  @param {string} path - path of the fetch
         *  @param {string} query - query of the fetch
         *  @return A promise of a fetch
         */
        async get(serviceName, path, query){
            let url = `http://${
                process.env[serviceName.toUpperCase() + '_SERVICE_SERVICE_HOST']
                }/api/v1/${path}`;

            const qs = querystring.stringify(query);

            if (qs) url += `?${qs}`;
            if(!path)return null;
            return await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
        },
    },
};
