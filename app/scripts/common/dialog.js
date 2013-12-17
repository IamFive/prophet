'use strict';

/**
Sample:
	dialog.dialog({
		callback : function() { window.alert(1);}
	}).then(function(result){
		alert(result);
	});

Sample2:
	dialog.message('Record not Found!', 
					'The reucord you were looking for cannot be found.');


*/
angular.module('ui.dialog', [])
.run(['$templateCache', function($templateCache) {
	$templateCache.put('template/dialog/message.html',
	    '<div class="modal-header" style="margin-top:6px;">\n' +
	    '        <h3>{{ options.title }}</h3>\n' +
	    '</div>\n' +
	    '<div class="modal-body">\n' +
	    '        <p>{{ options.message }}</p>\n' +
	    '</div>\n' +
	    '<div class="modal-footer">\n' +
	    '        <button ng-repeat="btn in options.buttons" ng-click="close(btn.result)" class=btn ng-class="btn.cssClass">{{ btn.label }}</button>\n' +
	    '</div>\n'
    );
}])
.service('dialog', ['$modal',
	function($modal) {

		var dialogDefaults = {
			backdrop: true,
			keyboard: true,
			backdropClick: true,
			dialogFade: true,
			templateUrl: 'template/dialog/message.html',
		};

		var dialogOptions = {
			closeButtonText: 'Close',
			actionButtonText: 'Sure',
			title: 'Proceed?',
			message: 'Perform this action?'
		};

		this.dialog = function(customDialogDefaults, customDialogOptions) {
			customDialogDefaults = customDialogDefaults ? customDialogDefaults : {};
			customDialogDefaults.backdropClick = false;
			return this._dialog(customDialogDefaults, customDialogOptions);
		};

		this._dialog = function(customDialogOptions, customDialogDefaults) {
			//Create temp objects to work with since we're in a singleton service
			var defaults = {};
			var options = {};

			//Map angular-ui dialog custom defaults to dialog defaults defined in this service
			angular.extend(defaults, dialogDefaults, customDialogDefaults);

			//Map dialog.html $scope custom properties to defaults defined in this service
			angular.extend(options, dialogOptions, customDialogOptions);

			if (!defaults.controller) {
				defaults.controller = function($scope, $modalInstance) {
					$scope.options = options;
					$scope.options.buttons = [{
						result: $scope.options.closeButtonText,
						label: $scope.options.closeButtonText
					}, {
						result: $scope.options.actionButtonText,
						label: $scope.options.actionButtonText,
						cssClass: 'btn-primary'
					}];

					$scope.close = function(result) {
						if ( result === $scope.options.closeButtonText) {
							$modalInstance.dismiss();
						} else {
							$modalInstance.close(result);
							if (angular.isFunction(options.callback)) {
								options.callback();
							}
						}
					};
				};
			}

			return $modal.open(defaults).result;
		};

		this.message = function(title, message, buttons) {
			var defaultButtons = [{
				result: 'OK',
				label: 'OK',
				cssClass: 'btn-primary'
			}];

			return $modal.open({
				dialogFade: true,
				templateUrl: 'template/dialog/message.html',
				controller: 'MessageBoxController',
				resolve: {
					options: function() {
						return {
							title: title,
							message: message,
							buttons: buttons ? buttons : defaultButtons
						};
					}
				}
			}).result;
		};

	}
]);


angular.module('ui.dialog').controller('MessageBoxController', ['$scope', '$modalInstance', 'options', 
	function($scope, instance, options) {
		$scope.options = options;
		$scope.close = function(res) {
			instance.close(res);
		};
	}
]);