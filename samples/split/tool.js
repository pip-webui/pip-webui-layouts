/**
 * @file Sample tool module
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipTool', ['pipTool.View']);

    thisModule.config(
        function ($stateProvider, pipSplitProvider, $mdIconProvider) {
            $mdIconProvider.iconSet('icons', '../images/icons.svg', 512);

            // Configure module routes
            $stateProvider
                .state('tool', {
                    url: '/tool',
                    controller: 'ToolController',
                    template: '<div ui-view></div>',
                    abstract: true
                })
                .state('tool.edit', {
                    url: '/edit/:id',
                    controller: 'ToolEditController',
                    templateUrl: 'tool_edit.html'
                })
                .state('tool.new', {
                    url: '/new',
                    controller: 'ToolNewController',
                    templateUrl: 'tool_new.html'
                })
                .state('tool.view', {
                    controller: 'ToolViewController',
                    template: '<div ui-view></div>',
                    abstract: true
                })
                .state('tool.view.tiles', {
                    url: '?search',
                    reloadOnSearch: false,
                    controller: 'ToolTilesController',
                    templateUrl: 'tool_tiles.html'
                })
                .state('tool.view.split', {
                    url: '/split',
                    controller: 'ToolSplitController',
                    templateUrl: 'tool_split.html',
                    abstract: true
                })
                .state('tool.view.split.list', {
                    url: '?id&search',
                    reloadOnSearch: false,
                    controller: 'ToolSplitListController',
                    templateUrl: 'tool_split_list.html'
                })
                .state('tool.view.split.details', {
                    url: '/:id?show',
                    reloadOnSearch: false,
                    controller: 'ToolSplitDetailsController',
                    templateUrl: 'tool_split_details.html'
                })
                .state('tool.view.split.sub1', {
                    url: '/:id/sub1?sub1_id',
                    reloadOnSearch: false,
                    controller: 'ToolSplitSub1Controller',
                    templateUrl: 'tool_split_sub1.html'
                })
                .state('tool.view.split.sub1_details', {
                    url: '/:id/sub1/:sub1_id',
                    controller: 'ToolSplitSub1DetailsController',
                    templateUrl: 'tool_split_sub1_details.html'
                })
                .state('tool.view.split.sub2', {
                    url: '/:id/sub2',
                    controller: 'ToolSplitSub2Controller',
                    templateUrl: 'tool_split_sub2.html'
                });

            pipSplitProvider.addTransitionSequence([
                'tool.view.split.list', 'tool.view.split.details', 'tool.view.split.sub1',
                'tool.view.split.sub1_details', 'tool.view.split.sub2'
            ]);
        }
    );

    thisModule.controller('ToolController', function ($scope, $rootScope, $state, $location) {
        $scope.navCollection = [
            {id: 1, title: 'Tab 1'},
            {id: 2, title: 'Tab 2'},
            {id: 3, title: 'Tab 3'},
            {id: 4, title: 'Tab 4'}
        ];

        $scope.selected = {};
        $scope.itemCollection = createItems();

        $scope.updateStateUrl = updateStateUrl;
        $scope.transition = transition;
        $scope.getItem = getItem;
        $scope.selectItem = selectItem;

        return;
        // -------------------

        function createItem(id) {
            var item = {
                    title: id + 1,
                    id: id,
                    sub1: [],
                    sub2: []
                },
                i;

            for (i = 0; i < 10; i++) {
                item.sub1.push({
                    title: i + 1 + (id + 1),
                    id: String(id) + '-' + String(i)
                });

                item.sub2.push({
                    title: i + 1 + (id + 1),
                    id: 'a-' + String(id) + '-' + String(i)
                });
            }

            return item;
        }

        function createItems() {
            var items = [],
                i;

            for (i = 0; i < 40; i++) {
                items.push(createItem(i));
            }

            return items;
        }

        function findItemById(id, collection) {
            var i, j, item, subItem, subAction;

            for (i = 0; i < collection.length; i++) {
                item = collection[i];
                if (String(item.id) === String(id)) {
                    return item;
                }
                if (item.sub1) {
                    for (j = 0; j < item.sub1.length; j++) {
                        subItem = item.sub1[j];
                        subAction = item.sub2[j];
                        if (subItem.id === id) {
                            return subItem;
                        }
                        if (subAction.id === id) {
                            return subAction;
                        }
                    }
                }
            }

            return collection[0];
        }

        function getItem(id, collection, search) {
            return findItemById(id, collection || $scope.itemCollection);
        }

        function selectItem(id, collection, search) {
            var s = search || false;

            $scope.selectedItem = $scope.getItem(id, collection, s);
            if ($scope.selectedItem) {
                $rootScope.$state.params.id = $scope.selectedItem.id;
            }
        }

        function updateStateUrl(stateName, stateParams) {
            $location.replace().search(stateParams);
        }

        function transition(stateName, stateParams) {
            $state.transitionTo(stateName, stateParams);
        }
    });

})(window.angular);
