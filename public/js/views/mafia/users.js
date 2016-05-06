define([
    'underscore',
    'backbone',
    'text!templates/mafia/users.html'
], function (_, Backbone, template) {
    return Backbone.View.extend({
        tpl: _.template(template),

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl({collection: this.collection}));
        }
    });
});
