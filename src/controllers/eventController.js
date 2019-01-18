const db = require('../models')

//db.image.sync({force: true})

module.exports = {

    async create({warningId, fileURL}) {
        if(!fileURL) {
            return;
        }

        const instance = {
            warningId,
            fileURL,
        };

        try {
            const result = await db.image.create(instance)
            return result.dataValues;
        } catch (err) {
            console.error(err)
            throw err
        }
    }

}
