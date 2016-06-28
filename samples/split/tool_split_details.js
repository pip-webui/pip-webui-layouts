/**
 * @file Sample tool split details module
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipTool.Split.Details', []);

    thisModule.controller('ToolSplitDetailsController', function ($scope, $rootScope, $state, pipAppBar) {

        $scope.selectItem($state.params.id, $scope.itemCollection);
        $scope.selected.showPanel = $state.params.show || 'sub1';
        $scope.selected.itemCollection = $scope.selectedItem.sub2;

        // Configure application header
        pipAppBar.showTitleBreadcrumb([{title: 'Tool name', click: toList}, {title: $scope.selectedItem.title}]);
        pipAppBar.showMenuNavIcon();
        pipAppBar.showLocalActions([], []);

        $scope.onSub1Click = onSub1Click;
        $scope.onSub2Click = onSub2Click;
        $scope.onItemSelect = onItemSelect;
        $scope.onSwipeLeft = onSwipeLeft;
        $scope.onSwipeRight = onSwipeRight;

        return;
        // --------------------------------------------------------------------------------------------------------

        function onSub1Click(item) {
            if (!item.sub2) {
                return;
            }
            if ($rootScope.$sizeSmall) {
                $scope.transition('tool.view.split.sub1', {id: item.id});
            } else {
                $scope.selected.showPanel = 'sub1';
                $scope.updateStateUrl('tool.view.split.details', {id: item.id, show: 'sub1'});
            }
        }

        function onSub2Click(item) {
            if ($rootScope.$sizeSmall) {
                $scope.transition('tool.view.split.sub2', {id: item.id});
            } else {
                $scope.selected.showPanel = 'sub2';
                $scope.updateStateUrl('tool.view.split.details', {id: item.id, show: 'sub2'});
            }
        }

        function onItemSelect(index) {
            $state.go('tool.view.split.sub1', {
                id: $scope.selectedItem.id,
                sub1_id: $scope.selected.itemCollection[index].id
            });
        }

        function onSwipeLeft() {
            $scope.transition('tool.view.split.' + $scope.selected.showPanel, {id: $scope.selectedItem.id});
        }

        function onSwipeRight() {
            $scope.transition('tool.view.split.list', {id: $scope.selectedItem.id});
        }

        function toList() {
            // if ($scope.selected.viewType == 'split')
            $scope.transition('tool.view.split.list', {id: $scope.selectedItem.id});
            // else
            // $scope.transition('tool.view.tiles');
        }
    });

})(window.angular);
