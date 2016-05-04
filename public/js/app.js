var APP = APP || {};

define([
    'jquery',
    'underscore',
    'backbone',
    'router'
], function ($, _, Backbone, Router) {
    var initialize = function () {
        var url = window.location.hash;

        new Router();
        APP.chanel = _.extend({}, Backbone.Events);
        Backbone.history.start({silent: true});

        require([
            'views/init/header',
            'views/init/footer',
            'models/users'
        ], function (HeaderView, FooterView, UserModel) {
            var user = new UserModel();
            user.urlRoot = '/auth/user';
            user.fetch({
                success: function (user) {
                    APP.user = user;
                    start();
                },
                error: function (user, resp) {
                    console.log(resp.responseJSON);
                    url = 'auth/login';
                    start();
                }
            });

            function start() {
                new HeaderView();
                new FooterView();
                Backbone.history.fragment = '';
                Backbone.history.navigate(url, {trigger: true});
            }
        });
    };

    return {
        initialize: initialize
    };
});
