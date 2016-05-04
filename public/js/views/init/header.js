define([
    'underscore',
    'backbone',
    'text!templates/init/header.html'
], function (_, Backbone, HeaderTemplate) {
    return Backbone.View.extend({
        el: $('#header'),

        tpl: _.template(HeaderTemplate),

        events: {
            'click #logout': 'logout',
            'click #login': 'login'
        },

        initialize: function () {
            APP.chanel.on('loggedIn', this.render, this);
            APP.chanel.on('logout', this.render, this);
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl());
        },

        logout: function (e) {
            var model = new Backbone.Model({});
            model.urlRoot = '/auth/logout';
            model.fetch({
                success: function () {
                    APP.user = null;
                    APP.chanel.trigger('logout');
                    Backbone.history.navigate('auth/login', {trigger: true});
                }
            });
        },

        login: function (e) {
            e.preventDefault();
            Backbone.history.navigate('auth/login', {trigger: true});
        }
    });
});
