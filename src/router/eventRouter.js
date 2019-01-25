const express = require('express');
const EventController = require('../controllers/eventController');

/**
 Event Router
 @module router/eventRouter
 */

const router = express.Router();
/**
 *  @function
 *  @param {string} route - '/'
 *  @param {string} method - GET
 *  @return status of the response
 */
router.get('/', async (req, res) => {
    const result = await EventController.retrieve(req.query);
    await res.json(result);
});

/**
 *  @function
 *  @param {string} route - '/:id'
 *  @param {string} method - GET
 *  @return status of the response
 */
router.get('/:id', async (req, res) => {
    const r = await EventController.retrieveOne(req.params.id);
    if (r) {
        await res.json(r);
    } else {
        await res.send({ error: 'Warning with that id does not exist' }, 404);
    }
});

/**
 *  @function
 *  @param {string} route - '/municipality/:id'
 *  @param {string} method - GET
 *  @return status of the response
 */

router.get('/municipality/:id', async (req, res) =>{
    const response = await EventController.retrieveWithMunicipality(req.params.id);
    response ? res.json(response) : res.send({error : 'could not retrieve events from location'});
});

/**
 *  @function
 *  @param {string} route - '/:id'
 *  @param {string} method - PUT
 *  @return status of the response
 */
router.put('/:id', async (req, res) => {
    const result = await EventController.update(req.params.id, req.body);
    if (result) {
        await res.send(result)
    } else {
        await res.send({ error: 'Could not update warning' }, 500)
    }
});

/**
 *  @function
 *  @param {string} route - '/:id'
 *  @param {string} method - POST
 *  @return status of the response
 */

router.post('/', async (req, res) => {
    const instanceOrError = await EventController.create(req.body);
    await res.send(instanceOrError);
});



module.exports = router;
