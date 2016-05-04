define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.Router.extend({
        routes: {
            'auth/:id': 'auth',
            'get/:content/:id': 'item',
            'freeshgame': 'freeshgame',
            '*all': 'all'
        },

        auth: function (id) {
            var self = this;
            var viewUrl = 'views/auth/' + id;
            if (APP.user) {
                return Backbone.history.navigate('get/users/id=' +
                    APP.user.id, {trigger: true, replace: true});
            }

            require([viewUrl], function (View) {
                self.view ? self.view.undelegateEvents() : '';
                self.view = new View();
            });
        },

        item: function (content, id) {
            var self = this;
            var modelUrl = 'models/' + content;
            var viewUrl = 'views/' + content + '/item';

            require([modelUrl, viewUrl], function (Model, View) {
                var model = new Model({id: id});
                model.urlRoot = '/' + content;
                model.fetch({
                    success: function () {
                        self.view ? self.view.undelegateEvents() : '';
                        self.view = new View({model: model});
                    },
                    error: function (model, resp) {
                        console.log(resp.responseJSON);
                    }
                });
            });
        },

        freeshgame: function () {
            var self = this;
            if (!APP.user) {
                return Backbone.history.navigate('auth/login', {trigger: true, replace: true});
            }

            require(['views/freeshgame/freeshgame'], function (View) {
                self.view ? self.view.undelegateEvents() : '';
                self.view = new View();
            });
        },

        all: function () {
            console.log(404);
        }
    });
});
