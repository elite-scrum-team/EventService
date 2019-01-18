const services = require('../util/services');

if (!process.env.MAP_SERVICE_SERVICE_HOST) {
    process.env['MAP_SERVICE_SERVICE_HOST'] = '35.228.85.132';
}

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
