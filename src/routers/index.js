const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const indexRouter = require('../routers/v1/indexRouter');
const SendResponse = require('../middlewares/Response');

router.use('/v1', indexRouter, SendResponse());
router.get('/', indexController.index);

module.exports = router;