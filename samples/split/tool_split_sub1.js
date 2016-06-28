/**
 * @file Sample tool split sub1 module
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipTool.Split.Sub1', []);

    thisModule.controller('ToolSplitSub1Controller', function ($scope, $rootScope, $state, pipAppBar, $mdMedia) {

        $scope.selectItem($state.params.id, $scope.itemCollection);
        $scope.parentItem = $scope.selectedItem || {};
        $scope.selected.itemCollection = $scope.selectedItem.sub2;
        $scope.selectItem($state.params.sub1_id || $scope.selected.itemCollection[0].id, $scope.itemCollection);

        // Configure application header
        pipAppBar.showTitleBreadcrumb([
            {title: 'Tool name', click: toList},
            {
                title: $scope.parentItem.title,
                click: function () {
                    $scope.transition('tool.view.split.details', {id: $scope.parentItem.id});
                }
            },
            {title: 'Sub list'}
        ]);
        pipAppBar.showMenuNavIcon();
        pipAppBar.showLocalActions([], []);

        $scope.onItemSelect = onItemSelect;
        $scope.onSwipeRight = onSwipeRight;
        $scope.onSwipeLeft = onSwipeLeft;

        return;

        // --------------------------------------------------------------------------------------------------------

        function onItemSelect(index) {
            if ($mdMedia('xs')) {
                $state.go('tool.view.split.sub1_details', {
                    id: $scope.parentItem.id,
                    sub1_id: $scope.selected.itemCollection[index].id
                });
            } else {
                $scope.selectItem($scope.selected.itemCollection[index].id, $scope.itemCollection);
                var currentStateName = $state.current.name;

                $scope.updateStateUrl(currentStateName, {
                    id: $scope.parentItem.id,
                    sub1_id: $scope.selected.itemCollection[index].id
                });
            }
        }

        function onSwipeLeft() {
            if ($mdMedia('xs')) {
                $state.go('tool.view.split.sub1_details', {
                    id: $scope.parentItem.id// ,
                    // sub1_id: $scope.selected.itemCollection[index].id
                });
            }
        }

        function onSwipeRight() {
            $scope.transition('tool.view.split.details', {id: $scope.parentItem.id});
        }

        function toList() {
            if ($scope.selected.viewType === 'split') {
                $scope.transition('tool.view.split.list', {id: $scope.parentItem.id});
            } else {
                $scope.transition('tool.view.tiles');
            }
        }

    });

})(window.angular);
