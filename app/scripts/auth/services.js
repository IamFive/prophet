'use strict';

angular.module('prophet')
    .factory('Profiles', function(Requestor) {

        var Profiles = {};

        Profiles.me = function() {
            return Requestor.get('/profile/me');
        };

        return Profiles;
    })
    .factory('Auth', function(Requestor, Access, Profiles) {

        var levels = Access.levels,
            roles = Access.roles,
            anon = {
                email: '',
                role: roles.anon
            };


        var Auth = {};
        Auth.user = {};
        $.extend(Auth.user, anon);

        Auth.resetUser = function(user) {
            $.extend(Auth.user, user);
        };


        Auth.reloadUser = function() {
            return Profiles.me().then(function(result) {
                if (result.has_login) {
                    var user = result.user;
                    user.role = Access.roles.user;
                    Auth.resetUser(user);
                    return user;
                } else {
                    Auth.resetUser(anon);
                    return anon;
                }
            }, function(result) {
                Auth.resetUser(anon);
                return anon;
            });
        };


        Auth.login = function(formdata) {
            return Requestor.post('/authorize/login', formdata);
        };


        Auth.logout = function() {
            return Requestor.get('/authorize/logout').then(function() {
                Auth.resetUser(anon);
            });
        };


        /**
         * check whether current user has permission for "level&role"
         */
        Auth.authorize = function(level, role) {
            if (role === undefined) {
                role = Auth.user.role;
            }

            if (level && levels[level]) {
                return levels[level].bitMask & role.bitMask;
            }

            return false;
        };


        Auth.isLoggedIn = function() {
            var user = Auth.user;
            if (user.role.title === roles.anon.title) {
                return false;
            }
            return true;
        };

        /*
            register: function(user, success, error) {
                Requestor.post('/register', user).success(function(res) {
                    resetUser(res);
                    success();
                }).error(error);
            },
            */


        return Auth;
    });