var apiRoutes = require('express').Router();

apiRoutes.use('/message', require('../internal/messageManager'));

module.exports = apiRoutes;