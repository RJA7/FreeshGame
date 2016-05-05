var Handlers = require('./handlers');

module.exports = function (message, socket, sockets) {
    var handlers = new Handlers();

    if (message === 'маф') {
        return handlers.maf(message, socket, sockets);
    }
    if (message.charAt(0) === '!') {
        if (message.startsWith('!голос ')) {
            return handlers.golos(message, socket, sockets);
        }

        if (message.startsWith('!пров ')) {
            return handlers.check(message, socket, sockets);
        }

        if (message.startsWith('!убить ')) {
            return handlers.kill(message, socket, sockets);
        }

        if (message.startsWith('!спасти ')) {
            return handlers.save(message, socket, sockets);
        }

        if (message.startsWith('!рег')) {
            return handlers.reg(message, socket, sockets);
        }
    }

    return false;
};
