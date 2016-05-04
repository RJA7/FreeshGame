var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var trim = require('trim');
var xmlescape = require('xml-escape');
var validator = require('validator');
var sha1 = require('sha1');

var UserSchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'Name is too short'],
        maxlength: [16, 'Name is too long'],
        set: normalize
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Invalid email']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password is too short'],
        maxlength: [32, 'Password is too long'],
        set: crypt,
        secureOut: 101
    },
    freeshki: {
        type: Number,
        default: 0
    },
    role: {
        type: Number,
        default: 50         //user = 50, admin = 100
    }
});

UserSchema.options = {
    defaultSortField: '_id',
    defaultLimit: 10,
    defaultSecureIn: 0,
    defaultSecureOut: 0,
    filterField: 'name',
    searchFields: 'name'
};
module.exports = mongoose.model('user', UserSchema);

function normalize(val) {
    return xmlescape(trim(val));
}

function validateEmail(val) {
    return validator.isEmail(val);
}

function crypt (pass) {
    return sha1(pass);
}
