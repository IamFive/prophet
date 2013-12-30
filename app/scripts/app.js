'use strict';

// angular.module('rest.api', []);

angular.module('prophet')
	.constant('TransferStatus', {
		Unused : 2,
		Importing : 3,
		Imported : 4
	})
	.constant('RouteMap', [
		{name: 'index', path: '/', templateUrl: 'views/index.html', access: 'user'},

		{name: 'recipient-list', path: '/recipients', 
			templateUrl: 'views/recipients/list.html',
			controller: 'RecipientListCtrl', access: 'user'},
		{name: 'recipient-edit', path: '/recipients/:id/edit', 
			templateUrl: 'views/recipients/edit.html',
			controller: 'RecipientEditCtrl', access: 'user', 
			resolve: RecipientEditCtrl.resolve},
		{name: 'recipient-files', path: '/recipients/uploads', 
			templateUrl: 'views/recipients/uploads.html',
			controller: 'RecipientUploadListCtrl', access: 'user'},
		{name: 'recipient-import', path: '/recipients/zips/:id/import', 
			templateUrl: 'views/recipients/import.html',
			controller: 'RecipientImportCtrl', access: 'user', 
			resolve : RecipientImportCtrl.resolve},

		{name: 'template-list', path: '/templates', templateUrl: 'views/templates/list.html',
			controller: 'TemplateListCtrl', access: 'user'},
		{name: 'template-add', path: '/templates/add', templateUrl: 'views/templates/add.html',
			controller: 'TemplateAddCtrl', access: 'user', resolve : TemplateAddCtrl.resolve },
		{name: 'template-edit', path: '/templates/:id/:type', templateUrl: 'views/templates/add.html',
			controller: 'TemplateAddCtrl', access: 'user', resolve : TemplateAddCtrl.resolve },
		
		{name: 'campaign-list', path: '/campaigns', templateUrl: 'views/campaigns/list.html',
			controller: 'CampaignListCtrl', access: 'user'},
		{name: 'campaign-edit', path: '/campaigns/:id/edit', templateUrl: 'views/campaigns/add.html',
			controller: 'CampaignAddCtrl', access: 'user', resolve : CampaignAddCtrl.resolve},
		{name: 'campaign-add', path: '/campaigns/add', templateUrl: 'views/campaigns/add.html',
			controller: 'CampaignAddCtrl', access: 'user', resolve : CampaignAddCtrl.resolve},

		{name: 'login', path: '/login', controller: 'LoginCtrl', templateUrl: 'views/authorize/login.html',
			access: 'anon'}
	])

	.config(function($routeProvider, RouteMap) {

		// build route map
		var i = RouteMap.length,
			tool = null;

		while (i--) {
			tool = RouteMap[i];
			$routeProvider.when(tool.path, tool);
		}

		$routeProvider.otherwise({
			redirectTo: '/'
		});
	})

	.config(function($httpProvider) {
		// interceptor for authorize check
		var interceptor = ['$location', '$q',
			function($location, $q) {
				function success(response) {
					return response;
				}

				function error(response) {
					if (response.status === 401) {
						$location.path('/login');
						return $q.reject(response);
					} else {
						return $q.reject(response);
					}
				}

				return function(promise) {
					return promise.then(success, error);
				};
			}
		];

		$httpProvider.responseInterceptors.push(interceptor);

	})
	.config(['$httpProvider',
		// setup cross domain credentials
		function($httpProvider) {
			$httpProvider.defaults.withCredentials = true;
			// delete $httpProvider.defaults.headers.common['X-Requested-With'];
		}
	])

	// .config(['$tooltipProvider',
	// 	function($tooltipProvider) {
	// 		$tooltipProvider.setTriggers({
	// 			'mouseenter': 'mouseleave',
	// 			'click': 'click',
	// 			'focus': 'blur',
	// 			'never': 'mouseleave' // <- This ensures the tooltip will go away on mouseleave
	// 		});
	// 	}
	// ])
	.run(function($route, $templateCache, $http) {

		// cache templates, improve speed.
		angular.forEach($route.routes, function(r) {
			if (r.templateUrl) {
				$http.get(r.templateUrl, {
					cache: $templateCache
				});
			}
		});

	})

	.run(['$rootScope', '$location', 'Auth',
		function($rootScope, $location, Auth) {
			$rootScope.$on('$routeChangeStart', function(event, next, current) {
				$rootScope.error = null;
				if (!Auth.authorize(next.access)) {
					if (Auth.isLoggedIn()) {
						$location.path(next.path);
					} else {
						Auth.reloadUser().then(function(user) {
							if (Auth.isLoggedIn()) {
								// console.log(next.path);
								// $location.path(next.path);
							} else {
								$location.path('/login');
							}
						});
					}
				}
			});
		}
	])
	.controller('NavCtrl', function($scope, $location, Auth) {
		$scope.onLogout = function() {
			Auth.logout().then(function() {
				$location.path('/login');
			});
		};
	});