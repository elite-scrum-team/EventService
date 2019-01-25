const location = require('./location');

module.exports = {
    location: {
        create: (testing) => {
            return location
        },
        retrieve: (id__in) =>{
            return [location];
        },
        retrieveOne: () =>{
            return location
        }
    }


};
