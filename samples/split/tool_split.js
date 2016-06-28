/**
 * @file Sample tool split module
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipTool.Split', [
        'pipTool.Split.List', 'pipTool.Split.Details', 'pipTool.Split.Sub1',
        'pipTool.Split.Sub1.Details', 'pipTool.Split.Sub2'
    ]);

    thisModule.controller('ToolSplitController',
        function ($scope, $mdMedia, $rootScope, $state, $location, $controller) {
            $scope.$mdMedia = $mdMedia;
        });

})(window.angular);
