const ImageController = require('../controllers/imageController');
const EventController = require('../controllers/eventController');

const router = require('express').Router();

router
    .route('/').post(async (req, res) => {
    console.log(req.body);
    // Check if user is allowed to add image
    const eventId = req.body.eventId;
    const fileURL = req.body.fileURL;
    console.log("WarningID: ", eventId);
    console.log("FILEURL: ", req.body.fileURL);

    try {
        let event = await EventController.retriveOne(eventId);

        const result = await ImageController.create({eventId, fileURL});
        if(result) {
            await res.send(result)
        } else {
            await res.send({ error: 'Could not create status' })
        }
    } catch(err) {
        console.error(err);
        res.send(err, 500);
    }
});


module.exports = router;
