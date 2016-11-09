'use strict';

angular.module('pipLayout', ['wu.masonry', 'pipAuxPanel']);

import './media/MediaService';
import './media/ResizeFunctions';

import './layouts/MainDirective';
import './layouts/CardDirective';
import './layouts/DialogDirective';
import './layouts/DocumentDirective';
import './layouts/SimpleDirective';
import './layouts/TilesDirective';
import './auxpanel/index';

export * from './media/MediaService';
export * from './media/ResizeFunctions';