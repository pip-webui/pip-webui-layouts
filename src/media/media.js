/**
 * @file Media service to detect the width of pip-main container
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipLayout.Media', []);

    thisModule.service('$pipMedia',
        function ($rootScope, $timeout) {

            var windowWidth = null,
                sizes = {
                    'xs': false,
                    'gt-xs': false,
                    'sm': false,
                    'gt-sm': false,
                    'md': false,
                    'gt-md': false,
                    'lg': false,
                    'gt-lg': false,
                    'xl': false
                };
            
            return function (size) {
                if (size) {
                    return sizes[size];
                } else {
                    return {
                        addResizeListener: addResizeListener,
                        removeResizeListener: removeResizeListener
                    };
                }
            };

            var attachEvent = document.attachEvent;
            var isIE = navigator.userAgent.match(/Trident/);
            console.log(isIE);
            function requestFrame(fn){
                var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
                    function(fn){ return window.setTimeout(fn, 20); };

                return raf(fn);
            }

            function cancelFrame(){
                var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
                    window.clearTimeout;
                return function(id){ return cancel(id); };
            }

            function resizeListener(e){
                
                var win = e.target || e.srcElement;
                if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
                win.__resizeRAF__ = requestFrame(function(){
                    var trigger = win.__resizeTrigger__;
                    trigger.__resizeListeners__.forEach(function(fn){
                        fn.call(trigger, e);
                    });
                });
            }

            function objectLoad(e){
                this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
                this.contentDocument.defaultView.addEventListener('resize', resizeListener);
            }

            function addResizeListener(element, fn){
                if (!element.__resizeListeners__) {
                    element.__resizeListeners__ = [];
                    if (attachEvent) {
                        element.__resizeTrigger__ = element;
                        element.attachEvent('onresize', resizeListener);
                    }
                    else {
                        if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
                        var obj = element.__resizeTrigger__ = document.createElement('object');
                        obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
                        obj.__resizeElement__ = element;
                        obj.onload = objectLoad;
                        obj.type = 'text/html';
                        if (isIE) element.appendChild(obj);
                        obj.data = 'about:blank';
                        if (!isIE) element.appendChild(obj);
                    }
                }
                setSizes();
                if (fn) element.__resizeListeners__.push(fn);
                element.__resizeListeners__.push(setSizes);
            }

            function removeResizeListener(element, fn){
                if (fn) element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
                if (!element.__resizeListeners__.length) {
                    if (attachEvent) element.detachEvent('onresize', resizeListener);
                    else {
                        element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                        element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
                    }
                }
            }

            function setSizes() {
                windowWidth = window.innerWidth;
                sizes['xs'] = windowWidth <= 599;
                sizes['gt-xs'] = windowWidth >= 600;
                sizes['sm'] = windowWidth >= 600 && windowWidth <= 959;
                sizes['gt-sm'] = windowWidth >= 960;
                sizes['md'] = windowWidth >= 960 && windowWidth <= 1279;
                sizes['gt-md'] = windowWidth >= 1280;
                sizes['lg'] = windowWidth >= 1280 && windowWidth <= 1919;
                sizes['gt-lg'] = windowWidth >= 1920;
                sizes['xl'] = sizes['gt-lg'];

                $timeout(function () {
                    $rootScope.$apply();
                });
            }

        }
    );

})(window.angular, window._, window.jQuery);
