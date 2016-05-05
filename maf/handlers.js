var model = require('./model');
var game = require('./game');
var emily = {name: 'Emily'};

module.exports = function () {
    this.maf = function (message, socket, sockets) {
        if (!model.isRegistration && !model.isGame) {
            model.freeshCounter++;
        }

        if (model.freeshCounter > 2) {
            model.freeshCounter = 0;
            model.isRegistration = true;
            sockets.emit('message', {message: 'start register', user: emily});
            setTimeout(function () {
                game(sockets);
            }, 30000);
        }
    };

    this.reg = function (message, socket, sockets) {
        if (model.isRegistration) {
            socket.game = {out: 0};
            socket.game.id = model.players.push(socket) - 1;
        }
    };

    this.golos = function (message, socket, sockets) {
        var num = parseMessage(message);
        if (model.isCityTime && socket.game && !socket.game.golos) {
            socket.game.golos = num;
        }
    };

    this.kill = function (message, socket) {
        var num = parseMessage(message);
        if (model.isMafiaTime && socket.game && !socket.game.golos && socket.game.role == 'mafia') {
            socket.golos = num;
        }
    };

    this.check = function (message, socket) {
        var num = parseMessage(message);
        if (model.isWatTime && socket.game && !socket.game.golos && socket.game.role == 'wat') {
            socket.golos = num;
        }
    };

    this.save = function (message, socket) {
        var num = parseMessage(message);
        if (model.isWhoreTime && socket.game && !socket.game.golos && socket.game.role == 'whore') {
            socket.golos = num;
        }
    };
};

function parseMessage(message) {
    var regExp = /\d{1,2}/;
    return message.match(regExp)[0];
}
