/**
 * @file Sample dialog layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('app', ['ngMaterial', 'pipLayout']);

    thisModule.controller('AppController', function ($scope, $rootScope, $mdDialog) {
        $scope.openDialog = function (event) {
            $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'dialog.tmpl.html',
                targetEvent: event
            });
        };
    });

    thisModule.controller('DialogController', function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    });
})(window.angular);
