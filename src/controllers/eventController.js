const db = require('../models');
const MapService = require('../services/mapService');
/**
 Event Controller
 @module controllers/eventController
 */

module.exports = {
    /**
     *  @function
     *  @param {string} title - Title of the new event
     *  @oaram {Date} fromTime - Start time of the event
     *  @param {Date} toTime - End time of the event
     *  @param {string} link - Link to the event
     *  @param {string} description - A description of the event
     *  @param {Object}location - Latitude longitude of the event
     *  @param {string} userId - Who is the creator of the event
     *
     *  @return object of the new event
     */
    async create({ title, fromTime, toTime ,link ,description, location, userId}) {
        const instance = {
            title, fromTime, toTime, link , description, userId
        };

        try {
            // Create and get locationID from MapService
            const newLocation = await MapService.location.create(location);
            instance.locationID = newLocation.id;
            if(!newLocation) {
                throw new Error('Could not store location...');
            }

            const res =  await db.event.create(instance);

            await res.reload({include: [{all: true}]});
            return res.dataValues;
        } catch(err) {
            console.error(err);
            throw err;
        }
    },
    /**
     *  @function
     *  @param {number} offset - Offset of the array
     *  @param {number} limit - Amount of returned events
     *  @return Array of events
     */

    async retrieve({ offset, limit }) {
        try {
            limit = limit || 20;
            offset = offset || 0;

            const r =  await db.event.findAll({
                offset, limit,
                include: [{model: db.image}],
                order: [['createdAt', 'DESC']],
            });
            r.filter( e => Date.now() <= new Date(e.toTime));

            if(!r) return null;

            const ids = await r.map(it => it.dataValues.locationID);
            ids.filter(it => it);
            const locations = await MapService.location.retrieve({id__in: ids});

            const locationsObject = {};
            await locations.map(it => locationsObject[it.id] = it);

            return r.map(it => {
                const eventFromDatabase = it.dataValues;
                const location = locationsObject[eventFromDatabase.locationID];
                delete eventFromDatabase['locationID'];
                if (location)
                    eventFromDatabase.location = location;
                else
                    eventFromDatabase.location = null;
                return eventFromDatabase;
            })
        } catch (err) {
            console.error(err);
            throw err
        }
    },
    /**
     *  @function
     *  @param {string} id - EventId
     *  @return An event
     */

    async retrieveOne(id) {
        let instance = (await db.event.findByPk(id, {
            include: [{model: db.image}]
        }));

        if(!instance) {
            return null;
        }

        instance = instance.dataValues;

        const location = await MapService.location.retrieveOne(instance.locationID);

        delete instance['locationID'];
        instance.location = location;
        return instance;

    },
/*
    async retrieveContent(id) {
        const instance = await db.event.findByPk(id, {
            include: [{ all: true }]
        });
        if(!instance) return db.sequelize.Promise.reject("Instance failed");
        const content = Object.entries(instance.toJSON())
            .filter(([k, v]) => v instanceof Array && k !== 'Images')
            .map(([k, v]) => v.map(it => ({ type: k, data: it })));

        const flatContent = flatten(content);

        const sortedFlatContent =
            flatContent
                .sort((a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt));

        return sortedFlatContent
    },
*/

    /**
     *  @function
     *  @param {string} municipalityId - The municipality id
     *  @return An array of events
     */
    async retrieveWithMunicipality(municipalityId){
        try{
            const locationsObject = {};
            const events = await db.event.findAll({
            include: [{model: db.image}]
            });

            if(!events) return null;

            const ids = await events.map(it => it.dataValues.locationID).filter(it => it);

            const locations = await MapService.location.retrieve({id__in: ids});

            const result = await locations.filter(it => it.municipalityId === municipalityId);

            await result.map(it => locationsObject[it.id] = it);


            return events.filter(event =>  {
                const id = event.dataValues.locationID;
                if(locationsObject[id]){
                     const e = event.dataValues;
                     e.location = locationsObject[id];
                    delete e['locationID'];
                    return e;
                }
            })
        }catch (e) {
            console.error(e);
            throw e;
        }
    },

    /**
     *  @function
     *  @param {string} id - The event id
     *  @param {Object} values - The new values of the event
     *  @return An array of events
     */

    async update(id, values) {
        Object.keys(values).forEach((key) => (values[key] == null) && delete values[key]);

        try {
            const newLocation = await MapService.location.create(values.location);
            values.locationID = newLocation.id;
            if(!newLocation) {
                throw new Error('Could not store location...');
            }

            const event = await db.event.findByPk(id);
            return await event.update(values)
        } catch (err) {
            console.error(err);
            throw err
        }
    }
};

