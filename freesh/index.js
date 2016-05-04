var freeshCounter = 0;
var isRegistration = false;
var isGame = false;
var players = [];

module.exports = function (message, socket, sockets) {
    if (message === 'freesh' && !isRegistration && !isGame) {
        freeshCounter++;
    }
    if (message.at(0) === '!') {

    }
};
