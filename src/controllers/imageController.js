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
    },
    async update({eventId, fileURL}){
        if(!fileURL) return;
        let conf;

        try{
            await db.image.destroy({where: {eventId: eventId }}).then(e =>{
                conf = true;
            });

            if(conf){
                const result = await db.image.create({eventId, fileURL});
                return result.dataValues;
            }
        } catch(error){
            throw error;
        }
    }
};

