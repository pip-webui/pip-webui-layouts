var thisModule = angular.module('app', ['ngMaterial', 'pipLayout']);

thisModule.controller('AppController', function ($scope, $rootScope, $mdDialog) {
	$scope.openDialog = function (event) {
		$mdDialog.show({
			controller: 'DialogController',
			templateUrl: 'dialog.tmpl.html',
			targetEvent: event
		})
	};

	//$rootScope.$on('pipWindowResized', function (event, size) {
	//    console.log('Window width: ' + size.window.width 
	//        + ' height: ' + size.window.height 
	//        + ' size: ' + $scope.$size);
	//});

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
