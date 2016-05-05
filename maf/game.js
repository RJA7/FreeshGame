var model = require('./model');
var emily = {name: 'Emily'};

module.exports = function (sockets) {
    var players = model.players;
    var len = players.length;
    var i;

    model.isRegistration = false;
    model.isGame = true;

    giveRoles(sockets);

    cityTime();

    function cityTime() {
        var message = 'Mafia sleep. !голос цифра\n';
        model.isCityTime = true;

        for (i = 0; i < len; i++) {
            if (model.players[i]) {
                message += i + '. ' + model.players[i].user.name + '\n';
            }
        }
        sockets.emit('message', {message: message, user: emily});

        setTimeout(clearCityTime, 30000);
    }

    function clearCityTime() {
        var outsiderIndex;
        var outVal = model.players[0].game.out;
        model.isCityTime = false;
        i = len;
        while (i--) {
            if (model.players[i] && model.players[i].game.golos) {
                model.players[model.players[i].game.golos].game.out++;
                delete model.players[i].game.golos;
            }
        }
        for (i = 0; i < len; i++) {
            if (!model.players[i]) continue;
            if (model.players[i].game.out >= outVal) {
                outsiderIndex = i;
            }
            model.players[i].game.out = 0;
        }

        sockets.emit('message', {
            message: 'You kill ' + model.players[outsiderIndex].game.role, user: emily
        });

        delete model.players[outsiderIndex];
        cityTime();
    }

    function mafiaTime() {
        console.log('maf time');
        model.isMafiaTime = true;
        setTimeout(watTime, 30000);
    }

    function watTime() {
        model.isMafiaTime = false;
        model.isWatTime = true;
        setTimeout(whoreTime, 30000);
    }

    function whoreTime() {
        console.log('whore time');
        model.isWatTime = false;
        model.isWhoreTime = true;
        setTimeout(checkResult, 30000);
    }

    function checkResult() {
        console.log('result time');
        model.isWhoreTime = false;

    }
};

function giveRoles(sockets) {
    var len = model.players.length;
    var players = model.players;
    var maf = Math.floor(Math.random() * len);
    var whore;
    var wat;
    var i;

    while (!wat || wat == maf) {
        wat = Math.floor(Math.random() * len);
    }
    while (!whore || whore == maf || whore == wat) {
        whore = Math.floor(Math.random() * len);
    }
    model.players[maf].game.role = 'mafia';
    model.players[wat].game.role = 'wat';
    model.players[whore].game.role = 'whore';


    sockets.emit('message', {message: 'Registered ' + len + ' players.', user: emily});

    for (i = 0; i < len; i++) {
        players[i].emit('message', {
            message: 'Your role: ' + model.players[i].game.role || 'citizen',
            user: emily
        });
    }
}
