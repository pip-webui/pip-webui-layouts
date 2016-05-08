/**
 * @file Sample tool split sub1 details module
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';
        
    var thisModule = angular.module('pipTool.Split.Sub1.Details', []);

    thisModule.controller('ToolSplitSub1DetailsController', function ($scope, $rootScope, $state, pipAppBar) {
        if (!$rootScope.$sizeSmall) 
			$scope.transition('tool.view.split.sub1', {id: $state.params.id, area_id: $state.params.area_id});
        
		$scope.parentItem = $scope.getItem($state.params.id,  $scope.itemCollection);
        $scope.selectItem($state.params.sub1_id, $scope.itemCollection);
        $scope.onSwipeRight = onSwipeRight;

        // Configure application header
        pipAppBar.showMenuNavIcon();
        pipAppBar.showTitleBreadcrumb([
            { title: 'Tool name', click: function () {
                $scope.transition('tool.list', {id: $scope.parentItem.id});
            }},
            { title: $scope.parentItem.title, click: function () {
                $scope.transition('tool.view.split.details', {id: $scope.parentItem.id, show: 'sub1'});
            }},
            { title: 'Sub List', click: function () {
                $scope.transition('tool.view.split.sub1', {id:  $scope.parentItem.id, sub1_id: $scope.selectedItem.id});
            }},
            { title: $scope.selectedItem.title}
        ]);
        pipAppBar.showLocalActions([], []);

        $scope.$on('pipWindowResized', onWindowResized);
		
		return; 
		
		//----------------------------
		
        function onWindowResized() {
            if (!$rootScope.$sizeSmall)
                $scope.transition('tool.view.split.sub1', {id: $scope.parentItem.id, sub1_id: $scope.selectedItem.id});
        };

        function onSwipeRight() {
            $scope.transition('tool.view.split.sub1', {id:  $scope.parentItem.id, sub1_id: $scope.selectedItem.id});
        };

    });

})();
