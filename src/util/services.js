const fetch = require('node-fetch');
const querystring = require('querystring');

module.exports = {
    fetch: {
        async get(serviceName, path, query){
            let url = `http://${
                process.env[serviceName.toUpperCase() + '_SERVICE_SERVICE_HOST']
                }/api/v1/${path}`;

            const qs = querystring.stringify(query);

            if (qs) url += `?${qs}`;

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
