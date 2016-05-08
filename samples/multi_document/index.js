var thisModule = angular.module('app', ['ngMaterial', 'pipLayout']);

thisModule.controller('AppController', function($scope, $rootScope, $mdMedia) {

    $scope.$mdMedia = $mdMedia;

});
