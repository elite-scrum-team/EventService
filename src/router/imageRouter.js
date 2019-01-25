const ImageController = require('../controllers/imageController');
const EventController = require('../controllers/eventController');
/**
 Image Router
 @module router/imageRouter
 */


const router = require('express').Router();
/**
 *  @function
 *  @param {string} route - '/'
 *  @param {string} method - POST
 *  @return status of the response
 */
router.post('/',async (req, res) => {
    const eventId = req.body.eventId;
    const fileURL = req.body.fileURL;

    try {

        const result = await ImageController.create(
            { eventId, fileURL },
        );
        if (result) {
            await res.send(result);
        } else {
            await res.send({ error: 'Could not create' });
        }
    } catch (err) {
        console.error(err);
        res.send(err, 500);
    }
});
/**
 *  @function
 *  @param {string} route - '/'
 *  @param {string} method - PUT
 *  @return status of the response
 */

router.put('/', async (req, res)=>{
    try {
        const eventId = req.body.eventId;
        const fileURL = req.body.fileURL;

        const result = await ImageController.update({eventId, fileURL});
        if (result) {
            await res.send(result);
        } else {
            await res.send({error: 'Could not update'});
        }
    }catch(error){
        res.send({error: error})
    }
});

module.exports = router;
