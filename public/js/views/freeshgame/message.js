define([
    'underscore',
    'backbone',
    'text!templates/freeshgame/message.html'
], function (_, Backbone, template) {
    return Backbone.View.extend({
        tpl: _.template(template),

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl(this.model));
        }
    });
});
