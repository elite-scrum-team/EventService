
const express = require('express');

const app = express();

app.get('/', async (req, res) => {
    await res.send('vim > emax'); 
});

const port = process.env.port | 80;

app.listen(80, () => console.log(`listening on port ${port}`));
