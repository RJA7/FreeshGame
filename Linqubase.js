var mongoose = require('mongoose');
var User = require('./models/users');

mongoose.connect('mongodb://127.0.0.1:27017/freesh');

clear();
setTimeout(fill, 1000);

function clear() {
    User.remove({}, function () {
        console.log('Users removed');
    });
}

function fill() {
    var user;

    for (var i = 0; i < 100; i++) {
        user = new User();
        user.name = 'name' + i;
        user.email = 'email' + i + '@i.ua';
        user.password = i + 'password';
        user.freeshki = i + 100;
        user.save();
    }
    console.log('Users created');
}
