var express = require('express');
var router = express.Router();

module.exports = function () {
    router.use(function (req, res, next) {
        req.user = req.session.user;

        return next();
    });
    
    return router;
};
