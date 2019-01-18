const db = require('../models');
const MapService = require('../services/MapService');

const flatten = require('../util/flatten');

module.exports = {
    async create({ title, fromTime, toTime ,link ,description, location}) {
        const instance = {
            title, fromTime, toTime, link , description
        };

        try {
            // Create and get locationId from MapService
            const newLocation = await MapService.location.create(location);
            instance.locationId = newLocation.id;
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
            const r = db.event.findAll({
                offset, limit,
                include: [{model: db.image}]
            });

            const ids = await r.map(it => it.dataValues.locationId).filter(it => it);
            const locations = await MapService.location.retrieve({id__in: ids});

            const locationsObject = {};
            await locations.map(it => locationsObject[it.id] = it);

            return r.map(it => {
                const eventFromDatabase = it.dataValues;
                const location = locationsObject[eventFromDatabase.locationId];
                delete eventFromDatabase['locationId'];
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

    async retriveOne(id) {
        const instance = (await db.event.findByPk(id, {
            include: [{model: db.image}]
        })).dataValues;
        const location = await MapService.location.retrieveOne(instance.locationId);
        delete instance['locationId'];
        instance.location = location;
        return instance;

    },

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

