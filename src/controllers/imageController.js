const db = require('../models');

module.exports = {
    async create({eventId, fileURL}) {
        if(!fileURL) {
            return;
        }

        const instance = {
            eventId,
            fileURL,
        };

        try {
            const result = await db.image.create(instance);
            return result.dataValues;
        } catch (err) {
            console.error(err);
            throw err
        }
    }
};

