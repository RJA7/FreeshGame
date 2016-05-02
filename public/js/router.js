define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.Router.extend({
        view: null,

        routes: {
            '*all': 'all'
        },

        all: function () {
            console.log(404);
        }
    });
});
