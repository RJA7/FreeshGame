var User = require('../models/users');
var sha1 = require('sha1');
var randomString = require('random-strings');
var Mailer = require('../helpers/mailer');

module.exports = function () {
    var mailer = new Mailer();

    this.login = function (req, res, next) {
        var body = req.body || {};
        var password = sha1(body.password);
        var aggregateObj = [{$match: {email: body.email, password: password}}];
        var user;

        User.aggregate(aggregateObj).exec(function (err, users) {
            if (err) {
                return next(err);
            }

            user = users[0];
            if (!user) {
                err = {status: 400, message: 'Wrong login or password.'};

                return next(err);
            }

            req.session.user = user;
            delete user.password;

            return res.status(200).send(user);
        });
    };

    this.register = function (req, res, next) {
        var body = req.body || {};
        User.create(body, function (err) {
            if (err) {
                return next(err);
            }

            return res.status(200).send({message: 'Successfully registered.'});
        });
    };

    this.forgot = function (req, res, next) {
        var body = req.body || {};
        var session = req.session;
        var aggregateObj = [{$math: {email: body.email}}];
        var user;
        var code;

        User.aggregate(aggregateObj).exec(function (err, users) {
            if (err) {
                return next(err);
            }

            user = users[0];
            if (!user) {
                err = {status: 400, message: 'Wrong email.'};

                return next(err);
            }

            code = randomString.numeric(4);
            session.code = code;
            session.email = user.email;
            mailer.send(user.email, 'Restoring Password', 'Code: ' + code);

            return res.status(200).send({message: 'Code sent to your email.'});
        });
    };

    this.restore = function (req, res, next) {
        var body = req.body || {};
        var session = req.session;
        var code = body.code;
        var newPassword = randomString.alphaNumMixed(6);
        var crypted = sha1(newPassword);

        if (code === req.session.code) {
            User
                .findOneAndUpdate({email: session.email}, {$set: {password: crypted}})
                .exec(function (err, user) {
                    if (err) {
                        return next(err);
                    }

                    delete session.code;
                    delete session.email;
                    mailer.send(user.email, 'Restoring Password', 'New Password: ' + newPassword);

                    return res.status(200).send({message: 'New password sent to your email.'});
                });
        } else {
            return res.status(400).send({message: 'Wrong code.'});
        }
    };
};
