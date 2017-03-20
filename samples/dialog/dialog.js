/**
 * @file Sample dialog layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('appDialog', ['ngMaterial', 'pipLayout']);

    thisModule.controller('DialogMainController', function ($scope, $rootScope, $mdDialog) {
        $scope.openDialog = function (event) {
            $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'dialog/dialog.tmpl.html',
                targetEvent: event,
                clickOutsideToClose: true
            });
        };

        $rootScope.layoutTitle = "Dialog layout";
    });

    thisModule.controller('DialogController', function ($scope, $mdDialog) {
        $scope.item = {id: '7a26e18f78s87ftf8', po: '23432', start: '30 m 7 s ago', last: '12 m 34 s ago', activities: [
            {type: 'POST', time: '30 m 7 sec ago', check: true},
            {type: 'POST', time: '45 m 7 sec ago'},
            {type: 'POST', time: '1 hour 5 m 7 s ago', check: true}
        ]};

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
         $scope.onToggleMenu = function() {
                $mdSidenav('left').toggle();
            };
    });
})(window.angular);
