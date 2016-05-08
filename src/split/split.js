/**
 * @file Split layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Split', []);

    thisModule.run( function($rootScope, pipSplit) {
        // Intercept routes
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                // Split animation
                var splitElements = $('.pip-split');
                if (splitElements.length > 0) {
                    splitElements.removeClass('pip-transition-forward');
                    splitElements.removeClass('pip-transition-back');
                    if (toState.name != fromState.name) {
                        if (pipSplit.forwardTransition(toState, fromState))
                            splitElements.addClass('pip-transition-forward');
                        else
                            splitElements.addClass('pip-transition-back');
                    }
                }

            }
        );

    });

    thisModule.provider('pipSplit', function() {
        var transitionSequences = [];

        this.addTransitionSequence = addTransitionSequence;

        this.$get = function () {
            return {
                forwardTransition: forwardTransition
            };
        };

        return;

        //----------------------------

        function addTransitionSequence(sequence) {
            if (!_.isArray(sequence) || sequence.length == 0)
                throw new Error('Transition sequence must be an array of state names');

            transitionSequences.push(sequence);
        }

        function forwardTransition(toState, fromState) {
            for (var i = 0; i < transitionSequences.length; i++) {
                var toIndex = transitionSequences[i].indexOf(toState.name);
                var fromIndex = transitionSequences[i].indexOf(fromState.name);

                if (toIndex > -1)
                    return toIndex > fromIndex;
            }
            return false
        }

    });

})();
