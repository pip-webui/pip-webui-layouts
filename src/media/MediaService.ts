'use strict';

export class MediaBreakpoints {
    public constructor(
        xs: number, sm: number, md: number, lg: number
    ) {
        this.xs = xs;
        this.sm = sm;
        this.md = md;
        this.lg = lg;
    }

    public xs: number;
    public sm: number;
    public md: number;
    public lg: number;
}

export class MediaBreakpointStatuses {
    public width: number;
    public 'xs': boolean;
    public 'gt-xs': boolean;
    public 'sm': boolean;
    public 'gt-sm': boolean;
    public 'md': boolean;
    public 'gt-md': boolean;
    public 'lg': boolean;
    public 'gt-lg': boolean;
    public 'xl': boolean;

    public update(breakpoints: MediaBreakpoints, width: number) {
        if (breakpoints == null) return;

        this.width = width;
        this['xs'] = width <= breakpoints.xs;
        this['gt-xs'] = width > breakpoints.xs;
        this['sm'] = width > breakpoints.xs && width <= breakpoints.sm;
        this['gt-sm'] = width > breakpoints.sm;
        this['md'] = width > breakpoints.sm && width <= breakpoints.md;
        this['gt-md'] = width > breakpoints.md;
        this['lg'] = width > breakpoints.md && width <= breakpoints.lg;
        this['gt-lg'] = width > breakpoints.lg;
        this['xl'] = this['gt-lg'];
    }
}

export let MainResizedEvent: string = 'pipMainResized';
export let LayoutResizedEvent: string = 'pipLayoutResized';

export let MainBreakpoints: MediaBreakpoints = new MediaBreakpoints(768, 1199, 1399, 1919);
export let MainBreakpointStatuses: MediaBreakpointStatuses = new MediaBreakpointStatuses();

export interface IMediaService {
    (breakpoint: string): boolean;
    breakpoints: MediaBreakpoints;
    width: number;
} 

export interface IMediaProvider extends ng.IServiceProvider {
    breakpoints: MediaBreakpoints;
}

class MediaProvider {
    public get breakpoints(): MediaBreakpoints {
        return MainBreakpoints;
    }

    public set breakpoints(value: MediaBreakpoints) {
        MainBreakpoints = value;
    }

    public $get() {
        let service = function(size) {
            return MainBreakpointStatuses[size];
        }

        Object.defineProperty(service, 'breakpoints', {
            get: () => { return MainBreakpoints; },
            set: (value) => { 
                MainBreakpoints = value || new MediaBreakpoints(768, 1199, 1399, 1400);
                
                MainBreakpointStatuses.update(
                    MainBreakpoints, 
                    MainBreakpointStatuses.width
                );
            }
        });

        Object.defineProperty(service, 'width', {
            get: () => { 
                return MainBreakpointStatuses.width; 
            }
        });

        return service; 
    }
}

angular
    .module('pipLayout')
    .provider('pipMedia', MediaProvider);
