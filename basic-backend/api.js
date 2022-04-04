const express = require('express');
const router = express.Router();

const echoController = require('./controllers/echo');
const logger = require('./util/logger');
const cors = require("cors");

router.use(cors());
router.use(express.json());
router.use(logger.logToConsole);

router.use('/echo', echoController);

router.use((req, res) => {
    res.status(404);
    res.send('Route does not exist');
});

module.exports = router;
