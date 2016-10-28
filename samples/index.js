/* global angular */

(function () {
    'use strict';

    var content = [
        { title: 'Card', state: 'card', url: '/card', controller: 'CardController', templateUrl: 'card/card.html' },
        { title: 'Dialogs', state: 'dialogs', url: '/dialogs', controller: 'DialogMainController', templateUrl: 'dialog/dialog.html' },
        { title: 'Simple', state: 'simple', url: '/simple', controller: 'SimpleController', templateUrl: 'simple/simple.html' },
        { title: 'Document', state: 'document', url: '/document', controller: 'DocumentController', templateUrl: 'document/document.html' },
        { title: 'Multi Document', state: 'multi_document', reloadOnSearch: false, url: '/multi_document?id', controller: 'MultiDocumentController', templateUrl: 'multi_document/multi_document.html' },
        { title: 'Document list', state: 'document_list', reloadOnSearch: false, url: '/document_list?id', controller: 'MultiDocumentController', templateUrl: 'document_list/document_list.html' },
        { title: 'Tiles', state: 'tiles', url: '/tiles', controller: 'TilesController', templateUrl: 'tiles/tiles.html' },
        { title: 'Tile groups', state: 'tile_groups', url: '/tile_groups', controller: 'TileGroupsController', templateUrl: 'tile_groups/tile_groups.html' },
        { title: 'Media', state: 'media', url: '/media', controller: 'MediaController', templateUrl: 'media/media.html' }
    ];

    var thisModule = angular.module('app',
        [
            // 3rd Party Modules
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'angularFileUpload', 'ngAnimate',
			
            'appCard', 'appDialog', 'appSimple', 'appDocument', 'appMultiDocument', 'appTileGroups',
            'appTiles', 'appMedia'
        ]
    );

    thisModule.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider) {
            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            for (var i = 0; i < content.length; i++) {
                var contentItem = content[i];
                $stateProvider.state(contentItem.state, contentItem);
            }

            $urlRouterProvider.otherwise('/card');
        }
    );

    thisModule.controller('AppController', 
        function ($scope, $rootScope, $state, $mdSidenav, $mdTheming, localStorageService) {
            $scope.languages = ['en', 'ru'];
            $scope.themes = _.keys(_.omit($mdTheming.THEMES, 'default'));
            $rootScope.$theme = localStorageService.get('theme');
            $rootScope.rightPanel = false;

            $scope.selected = {
                theme: 'blue',
                tab: 0  
            };

            $scope.content = content;
            $scope.menuOpened = false;

            $scope.onLanguageClick = function(language) {
               // pipTranslate.use(language);
            };

            // Update page after language changed
            $rootScope.$on('languageChanged', function(event) {
                console.log('Reloading...');
                console.log($state.current);
                console.log($state.params);

                $state.reload();
            });

            // Update page after theme changed
            $rootScope.$on('themeChanged', function(event) {
                $state.reload();
            });
                        
            $scope.onSwitchPage = function(state) {
                $mdSidenav('left').close();
                $state.go(state);
            };
            
            $scope.onToggleMenu = function() {
                $mdSidenav('left').toggle();
            };
                        
            $scope.isActiveState = function(state) {
                return $state.current.name == state;  
            };
            
            $scope.lockRightPanel = function () {
                return $rootScope.rightPanel;
            }
        }
    );

})();
