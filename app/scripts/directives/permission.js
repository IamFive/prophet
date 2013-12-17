'use strict';

angular.module('ui.directives')
.directive('accessLevel', ['Auth', function(Auth) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var prevDisp = element.css('display'),
                role,
                level;

            $scope.user = Auth.user;
            $scope.$watch('user', function(user) {
                if(user.role) {
                    role = user.role;
                }
                updateCSS();
            }, true);

            attrs.$observe('accessLevel', function(al) {
                level = al;
                updateCSS();
            });

            function updateCSS() {
                if(role && level) {
                    if(!Auth.authorize(level, role)) {
                        $(element).hide();
                        // $(element).remove();
                        // element.css('display', 'none');
                    } else {
                        $(element).show();
                        // element.css('display', prevDisp);
                    }
                }
            }
        }
    };
}]);