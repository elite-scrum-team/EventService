const express = require('express');
const EventController = require('../controllers/eventController');

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await EventController.retrieve(req.query);
    await res.json(result)
});

router.get('/:id', async (req, res) => {
    const r = await EventController.retrieveOne(req.params.id);
    if (r) {
        await res.json(r);
    } else {
        await res.send({ error: 'Warning with that id does not exist' }, 404);
    }
});

router.put('/:id', async (req, res) => {
    const result = await EventController.update(req.params.id, req.body);
    if (result) {
        await res.send(result)
    } else {
        await res.send({ error: 'Could not update warning' }, 500)
    }
});

router.post('/', async (req, res) => {
    const instanceOrError = await EventController.create(req.body);
    await res.send(instanceOrError);
});



module.exports = router;
