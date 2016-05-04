define([
    'underscore',
    'backbone',
    'text!templates/init/footer.html'
], function (_, Backbone, FooterTemplate) {
    return Backbone.View.extend({
        el: $('#footer'),

        tpl: _.template(FooterTemplate),

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl());
        }
    });
});

