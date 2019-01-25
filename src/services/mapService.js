const services = require('../util/services');
/**
 Map Service
 @module services/mapService
 */


module.exports = {
    location: {
        /**
         *  @function
         *  @param {Object} location - An object with latitude longitude
         *  @return JSON object with new location with municipality
         */
        async create(location) {
            const r = await services.fetch.post('map', 'location', {}, {
                location: location,
            });
            return r.json();
        },
        /**
         *  @function
         *  @param {string} id - Id of the location
         *  @return JSON object with location with municipality
         */
        async retrieveOne(id) {
            const r = await services.fetch.get('map', `location/${id}`, {});
            return r.json();
        },
        /**
         *  @function
         *  @param {Object} filters - An object with latitude longitude
         *  @return An array of JSON objects with locations
         */
        async retrieve(filters) {
            const r = await services.fetch.get('map', 'location', filters);
            return r.json();
        }
    }
};
