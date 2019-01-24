const services = require('../util/services');


module.exports = {
    location: {
        async create(location) {
            const r = await services.fetch.post('map', 'location', {}, {
                location: location,
            });
            return r.json();
        },
        async retrieveOne(id) {
            const r = await services.fetch.get('map', `location/${id}`, {});
            return r.json();
        },
        async retrieve(filters) {
            const r = await services.fetch.get('map', 'location', filters);
            return r.json();
        }
    }
};
