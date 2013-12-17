'use strict';


function TemplateAddCtrl($scope, $location, $routeParams, tpl, Templates) {


	function init() {

		$scope.tpl = tpl;
		$scope.action = $routeParams.type ? ($routeParams.type === 'clone' ? 'clone' : 'edit') : 'add';
		if ($scope.action !== 'add') {

			$scope.tpl.tokens.forEach(function(token){
				if (token.values) {
					token.str = token.values.join('\n');
				}
			});

			if($scope.action === 'clone') {
				delete $scope.tpl._id;
			}
		}
	}

	init();


	$scope.onAddFrom = function() {
		if ($scope.tpl.fromaddrs.indexOf($scope.from) === -1 && $scope.from) {
			$scope.tpl.fromaddrs = $scope.tpl.fromaddrs.concat($scope.from);
			$scope.from = null;
		}
	};

	$scope.onAddSubject = function() {
		if ($scope.tpl.subjects.indexOf($scope.subject) === -1 && $scope.subject) {
			$scope.tpl.subjects = $scope.tpl.subjects.concat($scope.subject);
			$scope.subject = null;
		}
	};

	$scope.vFrom = function(from) {
		if (!from || $scope.tpl.fromaddrs.indexOf(from) > -1) {
			return false;
		}
		return true;
	};

	$scope.vSubject = function(subject) {
		if (!subject || $scope.tpl.subjects.indexOf(subject) > -1) {
			return false;
		}
		return true;
	};

	/**
	 *
	 */
	$scope.onRemoveItem = function(target, item) {
		target.pop(item);
	};

	$scope.onAddToken = function() {
		$scope.tpl.tokens.push({});
	};

	$scope.onRemoveToken = function(item) {
		angular.forEach($scope.tpl.tokens, function(value, key){
			if (value.$$hashKey === item.$$hashKey) {
				$scope.tpl.tokens.splice(key, 1);
			}
		});
	};

	$scope.onSave = function() {
		angular.forEach($scope.tpl.tokens, function(t, key) {
			var value = t.str;
			if (value) {
				t.values = value.split('\n');
			}
		});

		if ('_id' in $scope.tpl) {
			Templates.update($scope.tpl._id, $scope.tpl).then(function(result) {
				$location.path('/templates');
			}, function(result) {
				window.alert(angular.toJson(result));
			});
		} else {
			Templates.add($scope.tpl).then(function(result){
				$location.path('/templates');
			}, function(result) {
				window.alert(angular.toJson(result));
			});
		}
	};
}


TemplateAddCtrl.resolve = {
	tpl: function(Templates, $route) {
		if ($route.current.params.id) {
			return Templates.get($route.current.params.id);
		} else {
			return {
				fromaddrs : [],
				tokens : [],
				subjects : []
			};
		}
	}
};


function TemplateListCtrl($scope, $location, Templates) {

	$scope.columnCollection = [
		{ label: 'title', map: 'title'}, 
		{ label: 'froms', map: 'fromaddrs'}, 
		{ label: 'open', map: 'stats.open'}, 
		{ label: 'click', map: 'stats.click'}, 
		{ label: 'created', map: 'created'},
		{ label: 'status', map: 'status', cellTemplateUrl: 'views/assets/status.html'}
	];

	$scope.globalConfig = {
		isPaginationEnabled: true,
		isGlobalSearchActivated: false,
		itemsByPage: 10,
		syncColumns: false,
		selectionMode: 'single'
	};

	// you can load data from remote here.
	$scope.ds = function(page, limit, sort, reverse) {
		return Templates.list(page, limit, sort, reverse);
	};


	$scope.$on('selectionChange', function (event, args) {
		if(args.item.isSelected) {
			$scope.selectedItem = args.item;
		}
	});


	$scope.gotoAdd = function() {
		$location.path('/templates/add');
	};


	$scope.onClone = function() {
		$location.path('/templates/' + $scope.selectedItem._id + '/clone');
	};


	$scope.onAction = function(action) {
		if($scope.selectedItem) {
			if (action === 'edit') {
				$location.path('/templates/' + $scope.selectedItem._id + '/edit');
			} else if (action === 'clone') {
				$location.path('/templates/' + $scope.selectedItem._id + '/clone');
			}
		} else {
			window.alert('please select a record.');
		}
	};


	$scope.onDelete = function() {
		if($scope.selectedItem) {
			Templates.delete($scope.selectedItem._id).then(function(){
				$scope.$broadcast('reloadST');
			});
		} else {
			window.alert('please select a record.');
		}
	};

}