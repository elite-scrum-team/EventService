const ImageController = require('../controllers/imageController');
const EventController = require('../controllers/eventController');

const router = require('express').Router();

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
