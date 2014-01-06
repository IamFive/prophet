'use strict';

angular.module('ui.helper', [])
	.factory('S2Helper', [
		function() {

			var helper = {};
			helper.selectOption = function(url, idfield, namefield, filterOptions) {

				return {
					url: url,
					data: function(term, page) {
						var filterBy = filterOptions ? filterOptions : {};

						if (term !== '') {
							filterBy[namefield + '__icontains'] = term;
						}

						return {
							'rformat': 'json',
							'where': angular.toJson(filterBy)
						};
					},
					results: function(data, page) {

						var data = data.result.data;
						var results = [];
						for (var i = data.length - 1; i >= 0; i--) {
							var item = data[i];
							results.unshift({
								'id': item[idfield],
								'text': item[namefield]
							});
						}

						return {
							results: results
						};
					}
				};
			};


			helper.tagOption = function(url, filterOptions) {

				return {
					url: url,
					data: function(term, page) {
						console.log(term);
						var filterBy = filterOptions ? filterOptions : {};
						if (term !== '') {
							filterBy.q = term;
						}

						filterBy.rformat = 'json';
						return filterBy;
					},
					results: function(data, page) {

						var data = data.result;
						var results = [];
						for (var i = data.length - 1; i >= 0; i--) {
							var item = data[i];
							results.unshift({
								'id': item,
								'text': item
							});
						}

						console.log(results)

						return {
							results: results
						};
					}
				};
			};

			return helper;
		}
	]);