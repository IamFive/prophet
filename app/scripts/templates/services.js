'use strict';

angular.module('prophet')
    .factory('Templates', function(Requestor) {
        var Templates = {};

        Templates.get = function(id) {
            return Requestor.get('/templates/' + id);
        };

        Templates.list = function(page, limit, sort, reverse, where) {
            return Requestor.list('/templates/', page, limit, sort, reverse, where);
        };

        Templates.add = function(template) {
            return Requestor.post('/templates/', template);
        };

        Templates.update = function(id, template) {
            return Requestor.put('/templates/' + id, template);
        };

        Templates.delete = function(id) {
            return Requestor['delete']('/templates/' + id);
        };

        return Templates;
    });