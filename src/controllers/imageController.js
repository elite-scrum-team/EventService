const db = require('../models');
/**
 Image Controller
 @module controllers/imageController
 */

module.exports = {
    /**
     *  @function
     *  @param {string} eventId - What event id the image belongs to
     *  @oaram {string} fileURL - the url of the image
     *  @return object of the new event
     */
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

    /**
     *  @function
     *  @param {string} eventId - What event id the image belongs to
     *  @oaram {string} fileURL - the url of the image
     *  @return returns the object of the image creation
     */
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

