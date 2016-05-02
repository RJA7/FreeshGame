var APP = APP || {};

define([
    'jquery',
    'underscore',
    'backbone',
    'router'
], function ($, _, Backbone, Router) {
    var initialize = function () {
        var url = window.location.hash;

        APP.chanel = _.extend({}, Backbone.Events);
        new Router();

        Backbone.history.start({silent: true});

        require([
            'views/main',
            'models/users'
        ], function (MainView, UserModel) {
            var user = new UserModel({_id: 1}, {urlRoot: 'users'});
            user.fetch({
                success: function () {
                    APP.user = user.has('name') ? user : null;
                    start();
                },
                error: function () {
                    start();
                }
            });

            function start () {
                new MainView();
                Backbone.history.fragment = '';
                Backbone.history.navigate(url, {trigger: true});
            }
        });
    };

    return {
        initialize: initialize
    };
});
