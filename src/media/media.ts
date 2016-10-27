/**
 * @file Media service to detect the width of pip-main container
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Media', []);

    thisModule.service('pipMedia',
        function ($rootScope, $timeout) {

            var elementWidth = null,
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
                },
                attachEvent = (<any>document).attachEvent,
                isIE = navigator.userAgent.match(/Trident/);
            
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

            function requestFrame(fn) {
                var raf = window.requestAnimationFrame || (<any>window).mozRequestAnimationFrame || (<any>window).webkitRequestAnimationFrame ||
                    function(fn){ return window.setTimeout(fn, 20); };

                return raf(fn);
            }

            function cancelFrame() {
                var cancel = window.cancelAnimationFrame || (<any>window).mozCancelAnimationFrame || (<any>window).webkitCancelAnimationFrame ||
                    window.clearTimeout;
                return function(id){ return cancel(id); };
            }

            function resizeListener(e) {
                var win = e.target || e.srcElement;
                if (win.__resizeRAF__) cancelFrame(/*win.__resizeRAF__*/);
                win.__resizeRAF__ = requestFrame(function(){
                    var trigger = win.__resizeTrigger__;
                    trigger.__resizeListeners__.forEach(function(fn){
                        fn.call(trigger, e);
                    });
                });
            }

            function objectLoad(e) {
                this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
                this.contentDocument.defaultView.addEventListener('resize', resizeListener);
            }

            function addResizeListener(element, fn) {
                if (!element.__resizeListeners__) {
                    element.__resizeListeners__ = [];
                    if (attachEvent) {
                        element.__resizeTrigger__ = element;
                        element.attachEvent('onresize', resizeListener);
                    }
                    else {
                        if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
                        var obj: any = element.__resizeTrigger__ = document.createElement('object');
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

            function removeResizeListener(element, fn) {
                if (fn) element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
                if (!element.__resizeListeners__.length) {
                    if (attachEvent) element.detachEvent('onresize', resizeListener);
                    else {
                        element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                        element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
                    }
                }
            }

            function updateClasses() {
                $.each(sizes, function (name, size) {
                    $('body')[size ? 'addClass': 'removeClass']('pip-' + name);
                });
            }

            function setSizes() {
                elementWidth = $('.pip-main').innerWidth();
                sizes['xs'] = elementWidth <= 768;
                sizes['gt-xs'] = elementWidth >= 769;
                sizes['sm'] = elementWidth >= 769 && elementWidth <= 1199;
                sizes['gt-sm'] = elementWidth >= 1200;
                sizes['md'] = elementWidth >= 1200 && elementWidth <= 1399;
                sizes['gt-md'] = elementWidth >= 1400;
                sizes['lg'] = elementWidth >= 1400 && elementWidth <= 1919;
                sizes['gt-lg'] = elementWidth >= 1920;
                sizes['xl'] = sizes['gt-lg'];

                updateClasses();

                $timeout(function () {
                    $rootScope.$apply();
                });
            }

        }
    );

})();
