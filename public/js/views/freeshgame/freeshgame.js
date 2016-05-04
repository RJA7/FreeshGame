define([
    'underscore',
    'backbone',
    'socket',
    'text!templates/freeshgame/freeshgame.html'
], function (_, Backbone, socket, Template) {
    return Backbone.View.extend({
        el: $('#container'),

        tpl: _.template(Template),

        events: {
            'click #send': 'send'
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
            require(['views/freeshgame/users'], function (View) {
                $('#users').html(new View({collection: users}).$el);
            });
        },

        message: function (data) {
            require(['views/freeshgame/message'], function (View) {
                $('#messages').append(new View({model: data}).$el);
                $('#scroll').scrollTop(Number.MAX_VALUE);
            });
        },

        send: function (e) {
            var message = $('#message');
            if (!message) return;
            APP.socket.emit('message', message.val());
            message.val('');
        }
    });
});
