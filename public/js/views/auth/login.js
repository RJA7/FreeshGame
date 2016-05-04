define([
    'underscore',
    'backbone',
    'text!templates/auth/login.html'
], function (_, Backbone, LoginTemplate) {
    return Backbone.View.extend({
        el: $('#container'),

        tpl: _.template(LoginTemplate),

        events: {
            'submit form': 'onSubmit'
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl());
        },

        onSubmit: function (e) {
            e.preventDefault();
            var inputs = $('input.form-input');
            var i = inputs.length;

            require(['models/users'], function (UserModel) {
                var user = new UserModel();
                user.urlRoot = '/auth/login';

                while (i--) {
                    user.set(inputs[i].name, inputs[i].value);
                }

                user.save(null, {
                    success: function () {
                        APP.user = user;
                        APP.chanel.trigger('loggedIn');
                        Backbone.history.navigate('get/users/id=' + user.id, {trigger: true});
                    },
                    error: function (user, resp) {
                        console.log(resp.responseJSON);
                    }
                });
            });
        }
    });
});
