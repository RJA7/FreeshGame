var model = require('./model');
var game = require('./game');
var emily = {name: 'Emily'};

module.exports = function () {
    var players = model.players;
    var len = players.length;

    this.maf = function (message, socket, sockets) {
        if (model.isRegistration || model.isGame) return;

        model.freeshCounter++;
        if (model.freeshCounter > 2) {
            model.freeshCounter = 0;
            model.isRegistration = true;
            sockets.emit('message', {message: 'Для регистрации введите: !рег', user: emily});
            setTimeout(function () {
                game(sockets);
            }, 30000);
        }
    };

    this.reg = function (message, socket) {
        if (!model.isRegistration) return;

        if (socket.game && players[socket.game.id] === socket) {
            return socket.emit('message', {message: 'Вы уже зарегистрированы.', user: emily});
        }

        socket.game = {
            id: players.push(socket) - 1,
            name: socket.request.session.user.name,
            out: 0
        };
        socket.emit('message', {message: 'Вы успешно зарегистрированы.', user: emily});
    };

    this.golos = function (message, socket) {
        var num = parseMessage(message);
        var all = true;
        var i;

        if (!model.isCityTime || !socket.game || !checker(socket, num)) return;

        socket.game.golos = num;
        socket.emit('message', {message: 'Голос принят.', user: emily});
        players[num].emit('message', {message: 'Против вас голосует ' + socket.game.name, user: emily});

        i = len;
        while (i--) {
            players[i] && !players[i].game.golos ? all = false : '';
        }
        if (all) {
            clearTimeout(model.timeoutId);
            model.next();
        }
    };

    this.kill = function (message, socket) {
        var num = parseMessage(message);

        if (!model.isMafiaTime || !socket.game || socket.game.role !== 'mafia' || !checker(socket, num)) return;

        socket.game.golos = num;
        clearTimeout(model.timeoutId);
        model.next();
    };

    this.wat = function (message, socket) {
        var num = parseMessage(message);

        if (!model.isWatTime || !socket.game || socket.game.role !== 'wat' || !checker(socket, num)) return;

        socket.emit('message', {
            message: 'Роль этого игрока: ' + players[num].game.role || 'мирный житель', user: emily});
        clearTimeout(model.timeoutId);
        model.next();
    };

    this.whore = function (message, socket) {
        var num = parseMessage(message);

        if (!model.isWhoreTime || !socket.game || socket.game.role !== 'whore' || !checker(socket, num)) return;

        socket.game.golos = num;
        clearTimeout(model.timeoutId);
        model.next();
    };


    function parseMessage(message) {
        var regExp = /\d{1,2}/;
        return message.match(regExp)[0];
    }

    function checker(socket, num) {
        var res = true;
        if (socket.game.golos) {
            socket.emit('message', {message: 'Вы уже проголосовали.', user: emily});
            res = false;
        }

        if (!players[num]) {
            socket.emit('message', {message: 'Нет такого игрока.', user: emily});
            res = false;
        }

        if (players[num] === socket) {
            socket.emit('message', {message: 'Вы ввели свой номер.', user: emily});
            res = false;
        }

        return res;
    }
};
