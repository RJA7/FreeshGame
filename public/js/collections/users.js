define([
    'backbone',
    'models/users'
], function (Backbone, Model) {
    return Backbone.Collection.extend({
        model: Model,

        url: function () {
            return '/users';
        }
    });
});
