declare module pip.layouts {

















export class MediaBreakpoints {
    constructor(xs: number, sm: number, md: number, lg: number);
    xs: number;
    sm: number;
    md: number;
    lg: number;
}
export class MediaBreakpointStatuses {
    width: number;
    'xs': boolean;
    'gt-xs': boolean;
    'sm': boolean;
    'gt-sm': boolean;
    'md': boolean;
    'gt-md': boolean;
    'lg': boolean;
    'gt-lg': boolean;
    'xl': boolean;
    update(breakpoints: MediaBreakpoints, width: number): void;
}
export let MainResizedEvent: string;
export let LayoutResizedEvent: string;
export let MainBreakpoints: MediaBreakpoints;
export let MainBreakpointStatuses: MediaBreakpointStatuses;
export interface IMediaService {
    (breakpoint: string): boolean;
    breakpoints: MediaBreakpoints;
    width: number;
}
export interface IMediaProvider extends ng.IServiceProvider {
    breakpoints: MediaBreakpoints;
}

export function addResizeListener(element: any, listener: any): void;
export function removeResizeListener(element: any, listener: any): void;

}
