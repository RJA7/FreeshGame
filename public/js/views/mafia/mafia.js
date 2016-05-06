define([
    'underscore',
    'backbone',
    'socket',
    'text!templates/mafia/mafia.html'
], function (_, Backbone, socket, Template) {
    return Backbone.View.extend({
        el: $('#container'),

        tpl: _.template(Template),

        events: {
            'click #send': 'send',
            'keydown #message': 'keyAction'
        },

        initialize: function () {
            if (!APP.socket) {
                APP.socket = socket.connect();
                APP.socket.on('users', this.users, this);
                APP.socket.on('message', this.message, this);
            }
            APP.socket.emit('users');
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl());
        },

        users: function (users) {
            require(['views/mafia/users'], function (View) {
                $('#users').html(new View({collection: users}).$el);
            });
        },

        message: function (data) {
            require(['views/mafia/message'], function (View) {
                $('#messages').append(new View({model: data}).$el);
                $('#scroll').scrollTop(Number.MAX_VALUE);
            });
        },

        send: function () {
            var message = $('#message');
            if (!message.val()) return;
            APP.socket.emit('message', message.val());
            message.val('');
        },

        keyAction: function (e) {
            var code = e.keyCode || e.which;
            if (code == 13) {
                this.send();
            }
        }
    });
});
