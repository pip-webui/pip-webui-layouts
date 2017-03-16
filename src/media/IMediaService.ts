export const MainResizedEvent = 'pipMainResized';
export const LayoutResizedEvent = 'pipLayoutResized';

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

export interface IMediaService {
    (breakpoint: string): boolean;
    breakpoints: MediaBreakpoints;
    width: number;
} 

export interface IMediaProvider extends ng.IServiceProvider {
    breakpoints: MediaBreakpoints;
}