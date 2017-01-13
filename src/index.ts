'use strict';

angular.module('pipLayout', ['wu.masonry', 'pipMedia', 'pipAuxPanel']);

import './media/index';

import './layouts/MainDirective';
import './layouts/CardDirective';
import './layouts/DialogDirective';
import './layouts/DocumentDirective';
import './layouts/SimpleDirective';
import './layouts/TilesDirective';
import './auxpanel/index';

export * from './media/index';
