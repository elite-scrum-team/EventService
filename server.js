const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const client = require('prom-client');
const db = require('./src/models');

require('dotenv').config();

const app = express();
const port = process.env.port || 4000;


db.sequelize.sync({ alter: true });

// middleware
app.use(bodyParser.json());

// metrics
client.collectDefaultMetrics({ timeout: 5000 });

app.get('/metrics', async (req, res) => {
    await res.set('Content-Type', client.register.contentType);
    await res.end(client.register.metrics());
});

// Logging
app.use(morgan('dev'));

// routers
app.use('/api/v1/event', require('./src/router/eventRouter'));
app.use('/api/v1/image', require('./src/router/imageRouter'));

app.get('/', async (req, res) => {
    await res.send({
        message: 'hello world!'
    });
});

app.listen(port, () => console.log(`listening on port ${port}`));
