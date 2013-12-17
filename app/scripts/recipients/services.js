'use strict';

angular.module('prophet')
    .factory('Recipients', function(Requestor) {

        var Recipients = {};

        Recipients.add = function(recipients) {
            return Requestor.post('/recipients/', recipients);
        };

        Recipients.get = function(id) {
            return Requestor.get('/recipients/' + id);
        };


        Recipients.list = function(page, limit, sort, reverse) {
            return Requestor.list('/recipients/', page, limit, sort, reverse);
        };


        Recipients.listFtps = function(page, limit, sort, reverse) {
            return Requestor.list('/recipients/ftps', page, limit, sort, reverse);
        };

        Recipients.listZips = function(page, limit, sort, reverse) {
            return Requestor.list('/recipients/zips', page, limit, sort, reverse);
        };

        Recipients.delete = function(id) {
            return Requestor['delete']('/recipients/' + id);
        };


        Recipients.transfer = function(name, relpath) {
            var path = '/recipients/ftps/transfer';
            return Requestor.post(path, {'relpath': relpath});
        };

        Recipients.getZipDesc = function(id) {
            var path = '/recipients/zips/' + id + '/desc';
            return Requestor.get(path);
        };

        Recipients.importZip = function(id, formdata) {
            var path = '/recipients/zips/' + id + '/import';
            return Requestor.post(path, formdata);
        };      

        Recipients.getTokens = function(id) {
            var path = '/recipients/tokens';
            return Requestor.get(path);
        };

        return Recipients;
    });