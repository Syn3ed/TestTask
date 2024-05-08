import express from 'express';
import router from './Router.js';
import Database from './BD.js';
const app = express();

app.use('/api', router);

app.use((req, res, next) => {
    res.status(404).send("none");
});

app.listen(3000)