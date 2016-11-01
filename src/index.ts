'use strict';

angular.module('pipLayout', ['wu.masonry']);

import './media/MediaService';
import './media/ResizeFunctions';

import './layouts/MainDirective';
import './layouts/CardDirective';
import './layouts/DialogDirective';
import './layouts/DocumentDirective';
import './layouts/SimpleDirective';
import './layouts/TilesDirective';

export * from './media/MediaService';
export * from './media/ResizeFunctions';