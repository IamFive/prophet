'use strick';

function LoginCtrl($scope, $location, Auth, dialog) {

	$scope.email = 'initial@abc.com';
	$scope.password = 'passwd';
	$scope.rememberme = false;


	$scope.onLogin = function() {

		Auth.login({
			email: $scope.email,
			password: $scope.password,
			// rememberme: $scope.rememberme
		}).then(function(result) {
			if (result) {
				Auth.reloadUser().then(function(user) {
					$location.path('/');
				});
			}
		}, function(result) {
			// $scope.failed = true;
			// $scope.message = result.message;
			dialog.message('Login Failed', result.message);
		});

	};
}