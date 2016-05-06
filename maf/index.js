var Handlers = require('./handlers');

module.exports = function (message, socket, sockets) {
    var handlers = new Handlers();

    if (message === 'маф') {
        handlers.maf(message, socket, sockets);
    }

    if (message.startsWith('!голос ')) {
        handlers.golos(message, socket, sockets);
    }

    if (message.startsWith('!убить ')) {
        handlers.kill(message, socket, sockets);
    }

    if (message.startsWith('!пров ')) {
        handlers.wat(message, socket, sockets);
    }

    if (message.startsWith('!спасти ')) {
        handlers.whore(message, socket, sockets);
    }

    if (message.startsWith('!рег')) {
        handlers.reg(message, socket, sockets);
    }
};
