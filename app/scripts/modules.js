angular.module('ui.permission', []);
angular.module('ui.directives', []);

var app = angular.module('prophet', ['ui.bootstrap', 'smartTable.table', 'ngRoute', 'ngCookies',
	'ui.permission', 'ui.directives', 'rest.api', 'ui.tinymce', 'ui.validate','ui.select2',
	'ui.dialog', 'ui.helper'
]);