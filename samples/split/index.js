/**
 * @file Controllers for split view sample page
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';
        
    var thisModule = angular.module('app', [
        'ui.router', 'ngMaterial', 'ngMessages', 'pipAppBar', 'pipTranslate', 'pipLayout', 'ngAnimate',
        'pipState', 'pipCore', 'pipTool', 'pipAppBar', 'pipTabs'
    ]);

    thisModule.config(
        function ($urlRouterProvider, $mdThemingProvider) {
            // Configure theme
            $mdThemingProvider.theme('blue')
                .primaryPalette('blue')
                .accentPalette('green');

            $urlRouterProvider.otherwise('/tool');
        }
    );

})();
