/**
 * @file Sample tool tiles module
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';
        
    var thisModule = angular.module('pipTool.Tiles', []);

    thisModule.controller('ToolTilesController', function ($scope, $rootScope, $state, pipAppBar, $location, pipCollections) {
        // Configure application header
        pipAppBar.showMenuNavIcon();
        pipAppBar.showTitleText('Tool Name');
        pipAppBar.showLocalActions([
            {
                name: 'big_picture.list', tooltip: 'VIEW_LIST',
                icon: 'icons:list', hideSmall: true,
                callback: onListView
            }
        ], []);
        pipAppBar.showSearch($scope.onSearch);
        pipAppBar.updateSearchCriteria($scope.search);

        $scope.itemId = $state.params.id;
        $scope.selected.itemId = $scope.itemId;
        $scope.selected.navId = $state.params.nav_id ? parseInt($state.params.nav_id) : $scope.selected.navId || 0;
        $scope.selected.selectItems();

        $scope.onItemSelect = onItemSelect;
        $scope.onNavigationChange = onNavigationChange;
        $scope.onTileClick = onTileClick;

        return;
        
        //----------------------

        function onItemSelect(index) {
            $scope.selectItem($scope.selected.itemCollection[index].id, $scope.itemCollection);
            if ($rootScope.$sizeSmall) {
                $scope.transition('tool.view.split.details', {id: $scope.selected.itemCollection[index].id});
            }
            else {
                $rootScope.$state.params.id = $scope.selected.itemCollection[index].id;
                $scope.updateStateUrl($rootScope.$state.name, $rootScope.$state.params);
            }
        };

        function onNavigationChange(nav) {
            $scope.navId = pipCollections.indexBy($scope.navCollection, 'id', nav.id);
            $scope.updateStateUrl($rootScope.$state.name, $rootScope.$state.params);
            $scope.selected.selectItems();
        };

        function onTileClick(item) {
            $scope.transition('tool.view.split.details', {id: item.id});
        };

        function onListView() {
            $scope.selected.viewType = 'split';
            $scope.transition('tool.view.split.list', $rootScope.$state.params);
        };

    });

})();
