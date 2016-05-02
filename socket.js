var emily = {name: 'Emily', picturePath: '/images/users/default.jpg'};
var httpSession = require('./libs/httpSession')();
var socketio = require('socket.io');

module.exports = function (server) {
    var sockets = socketio(server);

    sockets.use(function (socket, next) {
        httpSession(socket.request, socket.request.res, next);
    });

    sockets.on('connection', function (socket) {

    });
};
