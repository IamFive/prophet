'use strict';

angular.module('rest.api', ['env'])

/**
 * The Api service wraps AJAX API methods. Each method returns a promise object with
 * the knowledge of the method specifics.
 */
.provider('Requestor', function() {

    this.$get = function($http, $q, $rootScope, ApiUri) {

        var apiUrl = ApiUri;
        // var $http = $injector.get('$http');

        function errorHandler(response) {
            return $q.reject(response.data);
        }

        function parseResultHandler(response) {
            return response.data.result;
        }

        var instance = {};

        instance.post = function(name, params) {
            return $http.post(apiUrl + name, params)
                .then(parseResultHandler, errorHandler);
        };


        instance.get = function(name, params) {
            return $http({
                method: 'GET',
                url: apiUrl + name,
                params: params,
                withCredentials : true
            })
                .then(parseResultHandler, errorHandler);
        };

        instance.list = function(name, page, limit, sort, reverse, where) {

            var params = {
                page : page,
                limit : limit
            };

            if (sort) {
                params.sort = reverse ? sort : '-' + sort;
            }

            if (where) {
                params.where = angular.toJson(where);
            }


            return instance.get(name, params).then(function(result) {
                return {
                    page: result.page,
                    count: result.total,
                    data: result.data
                };
            });
        };


        instance['delete'] = function(name, params) {
            return $http['delete'](apiUrl + name, {
                params: params
            })
                .then(parseResultHandler, errorHandler);
        };

        instance.put = function(name, params) {
            return $http.put(apiUrl + name, params).then(parseResultHandler, errorHandler);
        };

        /**
         * Sends file though XMLHttpRequest2
         *
         * @memberOf ApiInstance
         *
         * @param {String} name
         * @param {File} file
         * @returns {Promise}
         */
        instance.postFile = function(name, file) {
            var deferred = $q.defer();

            var form = new FormData();
            form.append('file', file);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', apiUrl + name, true);
            xhr.onload = function(e) {
                if (e.target.status === 200) {
                    deferred.resolve();
                } else {
                    deferred.reject(e.target.status);
                }
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            };

            xhr.send(form);
            return deferred.promise;
        };

        return instance;
    };
});