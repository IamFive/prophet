'use strict';

function RecipientListCtrl($scope, $location, Recipients, dialog, S2Helper) {

	$scope.fileId = '';

	$scope.listnameSelector = {
		allowClear: true,
		placeholder: 'Pick import file',
		initSelection: function(element, callback) {
			//TO FIX BUG - https://github.com/ivaynberg/select2/issues/1470
			$scope.$watch('listname', function() {
				$scope.$broadcast('reloadST');
			});
        },
		ajax: S2Helper.selectOption('/api/recipients/zips/imports', 'listname', 'listname')
	};



	$scope.columnCollection = [
		{ label: 'email', map: 'email'}, 
		{ label: 'sent', map: 'stats.sent'}, 
		{ label: 'open', map: 'stats.open'}, 
		{ label: 'click', map: 'stats.click'}, 
		{ label: 'conversion', map: 'stats.conversion'}, 
		{ label: 'epm', map: 'stats.epm'}
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
		if ($scope.listname && $scope.listname.text) {
			var where = {'listname' : $scope.listname.text};
			return Recipients.list(page, limit, sort, reverse, where);
		}
		else {
			return Recipients.list(page, limit, sort, reverse);
		}
	};


	$scope.$on('selectionChange', function (event, args) {
		if(args.item.isSelected) {
			$scope.selectedItem = args.item;
		}
	});


	$scope.listImports = function() {
		$location.path('/recipients/uploads');
	};

	$scope.onEdit = function() {
		if($scope.selectedItem) {
			$location.path('/recipients/' + $scope.selectedItem._id + '/edit');
		} else {
			dialog.message('Not allowed', 'please select a record.');
		}
	};

	$scope.onDelete = function() {
		if($scope.selectedItem) {
			Recipients.delete($scope.selectedItem._id).then(function(){
				$scope.$broadcast('reloadST');
			});
		} else {
			dialog.message('Not allowed', 'please select a record.');
		}
	};
}


function RecipientUploadListCtrl($scope, $location, TransferStatus, Recipients, dialog) {

	$scope.actived = 'ftp';

	/**
		FTP file list
	 */
	$scope.ccFtp = [
		{ label: 'name', map: 'name', isSortable: false}, 
		{ label: 'path', map: 'relpath', isSortable: false,
			cellTemplateUrl: 'views/assets/ftp_path.html'}, 
		{ label: 'last-modified', map: 'mtime', isSortable: false}, 
		{ label: 'ext', map: 'ext', isSortable: false}, 
		{ label: 'size', map: 'size', isSortable: false}
	];

	$scope.gcFtp = {
		isPaginationEnabled: false,
		isGlobalSearchActivated: false,
		//itemsByPage: 10,
		syncColumns: false,
		selectionMode: 'single'
	};

	$scope.dsFtp = function(page, limit, sort, reverse) {
		return Recipients.listFtps(page, limit, sort, reverse);
	};


	/**
		Zip list defination start here.
	 */
	$scope.ccZip = [
		{ label: 'name', map: 'name'}, 
		{ label: 'success', map: 'success'}, 
		{ label: 'upload on', map: 'upload_on'}, 
		{ label: 'transfer on', map: 'import_on'}, 
		{ label: 'size', map: 'size'},
		{ label: 'status', map: 'status', 
			cellTemplateUrl: 'views/recipients/zip_status.html'}
	];

	$scope.gcZip = {
		isPaginationEnabled: true,
		isGlobalSearchActivated: false,
		itemsByPage: 10,
		syncColumns: false,
		selectionMode: 'single'
	};


	$scope.dsZip = function(page, limit, sort, reverse) {
		return Recipients.listZips(page, limit, sort, reverse);
	};


	$scope.$on('selectionChange', function (event, args) {
		if(args.item.isSelected) {
			if ($scope.actived === 'ftp') {
				$scope.selectedFtp = args.item;
			} else {
				$scope.selectedZip = args.item;
			}
		}
	});

	/**
		transfer file from ftp to server
	 */
	$scope.transfer = function() {
		if($scope.selectedFtp) {
			var relpath = $scope.selectedFtp.relpath;
			var name = $scope.selectedFtp.name;
			Recipients.transfer(name, relpath).then(function(result){
				$scope.$broadcast('reloadST');
				dialog.message('Success', 'File transfered success.');
			}, function(error) {
				dialog.message('Failed?', error.message);
			});
		} else {
			// just do nothing
			// dialog.message('Tips', 'U should choose a ftp file record.');
		}
	};

	/**
		go to import page
	 */
	$scope.goImport = function() {
		if ($scope.selectedZip) {
			if ($scope.selectedZip.status === TransferStatus.Unused) {
				$location.path('/recipients/zips/' + $scope.selectedZip._id + '/import');
			} else {
				dialog.message('Failed', 'Only Unused file can be imported.');
			}
		} 
	};
}


function RecipientEditCtrl($scope, Recipients, recipient, dialog) {
	$scope.recipient = recipient;


	$scope.onSave = function() {
		dialog.message(':)', 'not implemented yet.');
	};

}

RecipientEditCtrl.resolve = {
	recipient: function(Recipients, $route) {
		if ($route.current.params.id) {
			return Recipients.get($route.current.params.id);
		}
	}
};


function RecipientImportCtrl(desc, usedTokens, $scope, $location, Recipients, dialog, S2Helper) {

	$scope.desc = desc;
	$scope.usedTokens = usedTokens;


	// init header with first line values
	var ch = [];
	for (var i = 0, len = $scope.desc.columns.length; i < len; i++) {
		var lines = $scope.desc.columns[i];
		ch.push((lines && lines.length > 0) ? lines[0] : '');
	}

	// define regex for token validation
	var regex = /^[a-zA-Z][0-9a-zA-Z_]{0,19}$/;


	// $scope.headerAsToken = false;
	// $scope.ignoreHeader = false;
	// $scope.emailColIdx = null;
	// $scope.bkup = []
	$scope.ops = {
		'emailColIdx' : null,
		'headerAsToken' : false,
		'ignoreHeader' : false,
		'bkup' : []
	};

	$scope.listnameSelector = {
		allowClear: true,
		placeholder: 'input listname',
		initSelection: function(element, callback) {
			//TO FIX BUG - https://github.com/ivaynberg/select2/issues/1470
			// $scope.$watch('listname', function(){
			// });
		},
		createSearchChoice: function(term, data) {
			return {
				id: term,
				text: term
			};
		},
		ajax: S2Helper.selectOption('/api/recipients/zips/imports', 'listname', 'listname')
	};

	$scope.tagsSelector = {
		allowClear: true,
		'multiple': true,
		placeholder: 'input listname',
		initSelection: function(element, callback) {
			// $scope.$watch('tags', function(){
			// 	//console.log($scope.tags);
			// });
		},
		createSearchChoice: function(term, data) {
			return {
				id: term,
				text: term
			};
		},
		'simple_tags': true,
		'ajax': S2Helper.tagOption('/api/recipients/zips/imports/tags')
	};



	/**
		ignore-header button click handler
	 */
	$scope.$watch('ops.ignoreHeader', function(){
		// do nothing
	});


	/**
		header-as-token
	 */
	$scope.$watch('ops.headerAsToken', function(){
		if ($scope.ops.headerAsToken) {
			$scope.ops.emailColIdx = null;
			$scope.ops.bkup = [];
			for (var i = ch.length - 1; i >= 0; i--) {
				var t = $scope.desc.tokens[i];
				$scope.ops.bkup.unshift(t); // push to bakup
				$scope.desc.tokens[i] = ch[i];
			}
		} else {
			for (var m = $scope.ops.bkup.length - 1; m >= 0; m--) {
				$scope.desc.tokens[m] = $scope.ops.bkup[m];
			}
		}
	});


	/**
		click handler for email index radio
	 */
	$scope.$watch('ops.emailColIdx', function(){
		if ($scope.ops.emailColIdx !== null) {
			var idx = $scope.desc.tokens.indexOf('email');
			if (idx >= 0) {
				$scope.desc.tokens[idx] = '';
			}
			$scope.desc.tokens[$scope.ops.emailColIdx] = 'email';
		}
	});


	/**
		save import task.
	 */
	$scope.onSave = function() {

		if(!$scope.listname) {
			dialog.message('Failed', 'Listname cant be null.');
			return false;
		}

		if(!$scope.tags || $scope.tags.length === 0) {
			dialog.message('Failed', 'Tags cant be null.');
			return false;
		}


		// validate all tokens
		var illegals = [];
		var duplicated = [];
		for (var i = $scope.desc.tokens.length - 1; i >= 0; i--) {
			var token = $scope.desc.tokens[i];
			if (token !== '' && !regex.test(token)) {
				illegals.push(token);
			}

			if (token !== '' && $scope.desc.tokens.lastIndexOf(token) !== i) {
				duplicated.push(token);
			}
		}

		// validate whether token is unique
		if (duplicated.length > 0) {
			dialog.message('Failed', 'Token `{0}` is duplicated.'.format(duplicated.join()));
			return false;
		}

		if (illegals.length > 0) {
			dialog.message('Failed', 'Token `{0}` is illegal.'.format(illegals.join()));
			return false;
		}

		// validate email column
		var idx = $scope.desc.tokens.indexOf('email');
		if(idx >= 0) {
			// shall we auto detect this?
			$scope.ops.emailColIdx = idx;

			var formdata = {
				'tokens' : $scope.desc.tokens,
				'ignoreHeader' : $scope.ops.ignoreHeader,
				'emailColIdx' : idx,
				'listname' : $scope.listname.text,
				'tags' : $scope.tags
			};

			Recipients.importZip($scope.desc.zip_id, formdata).then(function(){
				$location.path('/recipients/uploads');
			});
		} else {
			dialog.message('Failed', 'You must specify a column as email column.');
		}
	};
}


RecipientImportCtrl.resolve = {
	desc : function(Recipients, $route) {
		if ($route.current.params.id) {
			return Recipients.getZipDesc($route.current.params.id);
		} 
	},
	usedTokens : function(Recipients) {
		return Recipients.getTokens();
	}
};