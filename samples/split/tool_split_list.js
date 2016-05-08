/**
 * @file Sample tool split list module
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';
        
    var thisModule = angular.module('pipTool.Split.List', []);

    thisModule.controller('ToolSplitListController', function ($scope, $rootScope, $state, pipAppBar, $location, pipCollections) {
        // Configure application header
        pipAppBar.showMenuNavIcon();
        pipAppBar.showTitleText('Tool Name');
        pipAppBar.showLocalActions([
            {
                name: 'big_picture.mind_map', tooltip: 'VIEW_TILES',
                icon: 'icons:grid', hideSmall: true,
                callback: onTilesView
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
        $scope.onSwipeLeft = onSwipeLeft;
        $scope.onSub1Click = onSub1Click;
        $scope.onSub2Click = onSub2Click;
        $scope.onSwipeLeft = onSwipeLeft;

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

        function onSwipeLeft() {
            $scope.transition('tool.view.split.details', {id: $scope.selectedItem.id});
        };

        function onSub1Click(item) {
            if (!item.sub2) return;

            $scope.transition('tool.view.split.details', {id: item.id, show: 'sub1'});
        };

        function onSub2Click(item) {
            if (!item.sub1) return;

            $scope.transition('tool.view.split.details', {id: item.id, show: 'sub2'});
        };

        function onTilesView() {
            $scope.selected.viewType = 'tiles';
            $scope.transition('tool.view.tiles', $rootScope.$state.params);
        };
    });

})();
