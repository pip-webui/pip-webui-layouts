'use strict';

suite('pipTiles', function () {

    suite('directive', function () {
        var $compile,
            $rootScope,
            scope,
            element,
            tilesContainer,
            sizer,
            template = '<pip-tiles><div class="pip-tile" ng-repeat="tile in tiles">{{ tile.name }}</div></pip-tiles>',
            tightTemplate = '<pip-tiles column-width="200"><div class="pip-tile" ng-repeat="tile in tiles">{{ tile.name }}</div></pip-tiles>';;

        function getRandomTile(number) {
            var random = Math.floor(Math.random() *  3);
            return {
                name: 'Tile #' + number,
                size: ['tile-lg', 'tile-md', 'tile-sm'][random]
            };
        }

        function getRandomTiles(number, count) {
            var result = [];
            count = count || 5;

            for (var i = 0; i < count; ++i) {
                result[i] = getRandomTile(number + i);
            }

            return result;
        }

        setup(function() {
            module('pipLayout.Tiles');
        });

        setup(function() {
            inject(function (_$compile_, _$rootScope_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
            })
        });

        setup(function () {
            scope   = $rootScope.$new();
            element = $compile(template)(scope);

            scope.tiles = getRandomTiles(1, 16);
            scope.$digest();

            tilesContainer = element.find('.pip-tiles-container');
            sizer = tilesContainer.find('.pip-tile-sizer')
        });

        test('insert template from url', function (done) {
            assert.equal(tilesContainer.length, 1);

            done();
        });

        test('transclude proper count of tiles', function (done) {
            var transcludedElements = tilesContainer.find('.pip-tile');

            assert.equal(transcludedElements.length, 16);

            done();
        });

        test('add class to element to container', function (done) {
            assert.isTrue(element.hasClass('pip-tiles'));

            done();
        });

        test('add sizer block to container', function (done) {
            assert.equal(sizer.length, 1);

            done();
        });

        test('set proper widths for small window', function (done) {
            assert.equal(tilesContainer.css('width'), '441px');
            assert.equal(sizer.css('width'), '440px');

            done();
        });

        test('change css width property on sizer and container depending on column or window width', function (done) {
            scope   = $rootScope.$new();
            element = $compile(tightTemplate)(scope);
            scope.tiles = getRandomTiles(1, 16);
            scope.$digest();

            tilesContainer = element.find('.pip-tiles-container');
            sizer = tilesContainer.find('.pip-tile-sizer')

            assert.equal(tilesContainer.css('width'), '849px');
            assert.equal(sizer.css('width'), '200px');

            done();
        });

    });

});


