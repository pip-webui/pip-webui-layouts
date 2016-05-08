/**
 * @file Sample tool split sub2 module
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';
        
    var thisModule = angular.module('pipTool.Split.Sub2', []);

    thisModule.controller('ToolSplitSub2Controller', function ($scope, $rootScope, $state, pipAppBar) {

        if (!$rootScope.$sizeSmall)
            $scope.transition('tool.view.split.details');
        $scope.parentItem = $scope.getItem($state.params.id,  $scope.itemCollection);
        $scope.selectItem($state.params.sub2_id, $scope.itemCollection);
        $scope.onSwipeRight = onSwipeRight;

        // Configure application header
        pipAppBar.showTitleBreadcrumb([
            { title: 'Tool name', click: function () {
                $scope.transition('tool.list', {id: $scope.parentItem.id});
            }},
            { title: $scope.parentItem.title, click: function () {
                $scope.transition('tool.view.split.details', {id: $scope.parentItem.id, show: 'sub2'});
            }},
            { title: 'Sub details'}
        ]);
        pipAppBar.showMenuNavIcon();
        pipAppBar.showLocalActions([], []);

        $scope.$on('pipWindowResized', onWindowResized);

        return;
        
        //------------------------------

        function onWindowResized() {
            if (!$rootScope.$sizeSmall)
                $scope.transition('tool.view.split.details', {id: $scope.parentItem.id});
        };

        function onSwipeRight() {
            $scope.transition('tool.view.split.details', {id:  $scope.parentItem.id});
        };

    });

})();
