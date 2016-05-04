var _ = require('underscore');
var httpSession = require('./libs/httpSession')();
var io = require('socket.io');
var users = [];
var freesh = require('./freesh');

module.exports = function (server) {
    var sockets = io(server);

    sockets.use(function (socket, next) {
        httpSession(socket.request, socket.request.res, next);
    });

    sockets.on('connection', function (socket) {
        var user = socket.request.session.user;
        if (!user) return;
        delete user.password;
        user.id = socket.id;
        users.push(user);

        socket.on('disconnect', function () {
            users = _.filter(users, function (userFromArr) {return userFromArr !== user; });
            sockets.emit('users', users);
        });

        socket.on('message', function (message) {
            freesh(message, socket, sockets);
            sockets.emit('message', {message: message, user: user});
        });

        socket.on('users', function () {
            socket.emit('users', users);
        });
    });
};
