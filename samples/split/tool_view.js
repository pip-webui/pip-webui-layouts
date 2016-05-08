/**
 * @file Sample tool view module
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';
        
    var thisModule = angular.module('pipTool.View', ['pipTool.Tiles', 'pipTool.Split']);

    thisModule.controller('ToolViewController', function ($scope, $rootScope, $state, pipAppBar, $location) {

        $scope.selected.selectItems = selectItems;
        $scope.search = $state.params.search;
        $scope.selected.viewType = $state.current.name.indexOf('split') > -1 ? 'split' : 'tiles';

        $scope.onSearch = onSearch;

        return;

        // --------------------------------------------------------------------

        function updateUrl() {
            $rootScope.$state.params.id = $scope.selectedItem.id;
            $rootScope.$state.params.search = $scope.search ? $scope.search : undefined;

            $scope.updateStateUrl($rootScope.$state.name, $rootScope.$state.params);
        }

        function onSearch (search) {
            $scope.search = search;
            pipAppBar.updateSearchCriteria(search);

            selectItems();
            updateUrl();
        };

        function filter(item) {
            if($scope.search && $scope.search.indexOf(item.title) < 0) return false;

            return true;
            //if ($scope.selected.navId == 1) {
            //    return (item.id > 5 && item.id < 11);
            //}
            //if ($scope.selected.navId == 2) {
            //    return (item.id > 10 && item.id < 21);
            //}
            //if ($scope.selected.navId == 3) {
            //    return item.id > 20;
            //}
            //return item.id < 6;
        };

        function selectItems() {
            $scope.selected.itemCollection = _.filter($scope.itemCollection, filter);
            if (!$scope.itemId) $scope.itemId = 0;
            $scope.selectItem($scope.selected.itemId, $scope.selected.itemCollection);
        };
    });

})();
