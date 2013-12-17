'use strict';

angular.module('prophet')
    .factory('Campaigns', function(Requestor) {

        var Campaigns = {};

        Campaigns.add = function(campaign) {
            return Requestor.post('/campaigns/', campaign);
        };

        Campaigns.get = function(id) {
            return Requestor.get('/campaigns/' + id);
        };


        Campaigns.list = function(page, limit, sort, reverse) {
            return Requestor.list('/campaigns/', page, limit, sort, reverse);
        };


        Campaigns.delete = function(id) {
            return Requestor['delete']('/campaigns/' + id);
        };

        return Campaigns;
    });