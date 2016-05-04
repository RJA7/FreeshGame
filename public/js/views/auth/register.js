define([
    'underscore',
    'backbone',
    'text!templates/auth/register.html'
], function (_, Backbone, RegisterTemplate) {
    return Backbone.View.extend({
        el: $('#container'),

        tpl: _.template(RegisterTemplate),

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
                user.urlRoot = '/auth/register';

                while (i--) {
                    user.set(inputs[i].name, inputs[i].value);
                }

                user.save(null, {
                    success: function () {
                        console.log(user.get('message'));
                        Backbone.history.navigate('auth/login', {trigger: true});
                    },
                    error: function (user, resp) {
                        console.log(resp.responseJSON);
                    }
                });
            });
        }
    });
});
