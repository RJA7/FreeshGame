define([
    'underscore',
    'backbone',
    'text!templates/users/item.html'
], function (_, Backbone, UserItemTemplate) {
    return Backbone.View.extend({
        el: $('#container'),

        tpl: _.template(UserItemTemplate),

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl(APP.user.toJSON()));
        }
    });
});
