const ImageController = require('../controllers/ImageController')
const WarningController = require('../controllers/WarningController');

const router = require('express').Router()

router
    .route('/').post(async (req, res) => {
    console.log(req.body);
    // Check if user is allowed to add image
    const warningId = req.body.warningId;
    const fileURL = req.body.fileURL
    console.log("WarningID: ", warningId);
    console.log("FILEURL: ", req.body.fileURL)

    try {
        let warning = await WarningController.retriveOne(warningId);
        /*
        if(warning.userId !== req.query.internalUserId) {
            res.send('Not authorized', 403);
            return;
        }
        */

        const result = await ImageController.create({warningId, fileURL}, req.query.internalUserId)
        if(result) {
            await res.send(result)
        } else {
            await res.send({ error: 'Could not create status' })
        }
    } catch(err) {
        console.error(err);
        res.send(err, 500);
    }
})


module.exports = router
