const db = require('../models');
const MapService = require('../services/mapService');

//const flatten = require('../util/flatten');

module.exports = {
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
            const res = await db.sequelize.transaction(async t => {
                return await db.event.create(instance);
            });

            await res.reload({include: [{all: true}]});
            return res.dataValues;
        } catch(err) {
            console.error(err);
            throw err;
        }
    },

    async retrieve({ offset, limit }) {
        try {
            const r =  await db.event.findAll({
                offset, limit,
                include: [{model: db.image}]
            });

            const ids = await r.map(it => it.dataValues.locationID).filter(it => it);
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
    async retrieveWithMunicipality(municipalityId){
        try{
            const locationsObject = {};
            const events = await db.event.findAll({
            include: [{model: db.image}]
            });

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

    async update(id, values) {
        try {
            const event = await db.event.findByPk(id);
            return await event.update(values)
        } catch (err) {
            console.error(err);
            throw err
        }
    }
};

