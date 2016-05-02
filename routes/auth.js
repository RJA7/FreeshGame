var express = require('express');
var router = express.Router();
var AuthHandler = require('../handlers/authHandler');

module.exports = function () {
    var authHandler = new AuthHandler();

    router.post('/login', authHandler.login);
    router.post('/register', authHandler.register);
    router.post('/forgot', authHandler.forgot);
    router.post('/restore', authHandler.restore);
    
    return router;
};
