var model = require('./model');
var emily = {name: 'Emily'};
var TIME = 30000;

module.exports = function (sockets) {
    var players = model.players;
    var len = players.length;
    var player;
    var i;
    model.isRegistration = false;

    if (len < 3) {
        return end('Недостаточно игроков для начала игры: ' + len);
    }

    model.isGame = true;

    giveRoles(sockets);

    cityTime();

    function cityTime() {
        model.isCityTime = true;

        sockets.emit('message', {
            message: 'Мафия засыпает. Город голосует - !голос цифра', user: emily
        });

        for (i = 0; i < len; i++) {
            if (player = players[i]) {
                sockets.emit('message', {
                    message: i + '. ' + player.game.name,
                    user: emily
                });
            }
        }

        model.timeoutId = setTimeout(clearCityTime, TIME);
        model.next = clearCityTime;
    }

    function clearCityTime() {
        var outsiderIndex;
        var outVal = 0;
        var golos;

        model.isCityTime = false;

        for (i = 0; i < len; i++) {
            if ((player = players[i]) && (golos = player.game.golos)) {
                players[golos].game.out++;
                delete player.game.golos;
            }
        }
        for (i = 0; i < len; i++) {
            if ((player = players[i]) && player.game.out >= outVal) {
                outsiderIndex = i;
                outVal = player.game.out;
                player.game.out = 0;
            }
        }

        sockets.emit('message', {
            message: 'Вы убили игрока ' + players[outsiderIndex].game.name + '. ' +
            'C ролью: ' + players[outsiderIndex].game.role || 'мирный житель.',
            user: emily
        });

        if (players[outsiderIndex] === model.mafia) {
            return end('Мирные жители победили.');
        }
        players[outsiderIndex] === model.wat ? delete model.wat : '';
        players[outsiderIndex] === model.whore ? delete model.whore : '';

        delete players[outsiderIndex];
        mafiaTime();
    }

    function mafiaTime() {
        model.isMafiaTime = true;

        sockets.emit('message', {
            message: 'Город засыпает. Мафия выбирает жертву.', user: emily
        });
        model.mafia.emit('message', {message: 'Введите: !убить цифра', user: emily});

        model.timeoutId = setTimeout(watTime, TIME);
        model.next = watTime;
    }

    function watTime() {
        model.isMafiaTime = false;
        model.isWatTime = true;

        if (!model.wat) whoreTime();

        sockets.emit('message', {
            message: 'Мафия выбрала жертву. Священник исповедует.', user: emily
        });
        model.wat.emit('message', {message: 'Введите: !пров цифра', user: emily});

        model.timeoutId = setTimeout(whoreTime, TIME);
        model.next = whoreTime;
    }

    function whoreTime() {
        model.isWatTime = false;
        model.isWhoreTime = true;

        if (!model.whore) clearWhoreTime();

        sockets.emit('message', {
            message: 'Шлюха выбирает кого спасти этой ночью.', user: emily
        });
        model.whore.emit('message', {message: 'Введите: !спасти цифра', user: emily});

        model.timeoutId = setTimeout(clearWhoreTime, TIME);
        model.next = clearWhoreTime;
    }

    function clearWhoreTime() {
        var livePlayers = 0;
        var golos = model.mafia.game.golos;

        model.isWhoreTime = false;

        if (model.whore && golos === model.whore.game.golos) {
            return sockets.emit('message', {
                message: 'Мафия пыталась убить игрока: ' +
                players[golos].game.name + ', но шлюха спасла его.', user: emily});
        }

        sockets.emit('message', {
            message: 'Мафия убила игрока: ' + players[golos].game.name, user: emily
        });

        model.whore ? delete model.whore.game.golos : '';
        delete model.mafia.game.golos;
        delete players[golos];

        i = len;
        while (i--) {
            players[i] ? livePlayers++ : '';
        }
        if (livePlayers < 2) {
            return end('Мафия победила.');
        }

        cityTime();
    }


    function giveRoles(sockets) {
        var roles = [];
        var mafia;
        var whore;
        var wat;
        var i;

        i = len;
        while (i--) {
            roles.push(i);
        }
        Array.prototype.shuffle = function() {
            return this.sort(function() {
                return 0.5 - Math.random();
            });
        };
        roles.shuffle();

        mafia = roles[0];
        whore = roles[1];
        wat = roles[2];

        players[mafia].game.role = 'mafia';
        players[whore].game.role = 'whore';
        players[wat].game.role = 'wat';

        model.mafia = players[mafia];
        model.whore = players[whore];
        model.wat = players[wat];

        sockets.emit('message', {message: 'Зарегистрировалось ' + len + ' игроков.', user: emily});

        for (i = 0; i < len; i++) {
            players[i].emit('message', {
                message: 'Ваша роль: ' + players[i].game.role || 'мирный житель.',
                user: emily
            });
        }
    }

    function end(message) {
        sockets.emit('message', {message: message, user: emily});
        model.players = [];
        model.isGame = false;
    }
};
