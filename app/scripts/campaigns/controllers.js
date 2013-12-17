'use strict';


function CampaignAddCtrl($scope, $location, campaign, Campaigns) {
	$scope.campaign = campaign;
	$scope.onAdd = function() {
		if ($scope.campaign._id) {
			Campaigns.update($scope.campaign).then(function(campaign){
				$location.path('/campaigns');
			});
		} else {
			Campaigns.add($scope.campaign).then(function(campaign){
				$location.path('/campaigns');
			});
		}
	};

}

CampaignAddCtrl.resolve = {
	campaign: function(Campaigns, $route) {
		if ($route.current.params.id) {
			return Campaigns.get($route.current.params.id);
		} else {
			return {};
		}
	}
};


function CampaignListCtrl($scope, $location, Campaigns) {

	$scope.columnCollection = [
		{ label: 'title', map: 'title'}, 
		{ label: 'sent', map: 'stats.sent'}, 
		{ label: 'open', map: 'stats.open'}, 
		{ label: 'click', map: 'stats.click'}, 
		{ label: 'conversion', map: 'stats.conversion'}, 
		{ label: 'revenue', map: 'stats.revenue'}, 
		{ label: 'unsub', map: 'stats.unsubscribe'}, 
		{ label: 'Abuse', map: 'stats.complaint'},
		{ label: 'updated', map: 'modified'},
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
		return Campaigns.list(page, limit, sort, reverse);
	};


	$scope.$on('selectionChange', function (event, args) {
		if(args.item.isSelected) {
			$scope.selectedItem = args.item;
		}
	});


	$scope.gotoAdd = function() {
		$location.path('/campaigns/add');
	};

	$scope.onEdit = function() {
		if($scope.selectedItem) {
			$location.path('/campaigns/' + $scope.selectedItem._id + '/edit');
		} else {
			window.alert('please select a record.');
		}
	};

	$scope.onDelete = function() {
		if($scope.selectedItem) {
			Campaigns.delete($scope.selectedItem._id).then(function(){
				$scope.$broadcast('reloadST');
			});
		} else {
			window.alert('please select a record.');
		}
	};
}