declare module pip.layouts {

export const MainResizedEvent = "pipMainResized";
export const LayoutResizedEvent = "pipLayoutResized";
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
export interface IMediaService {
    (breakpoint: string): boolean;
    breakpoints: MediaBreakpoints;
    width: number;
}
export interface IMediaProvider extends ng.IServiceProvider {
    breakpoints: MediaBreakpoints;
}


export let MainBreakpoints: MediaBreakpoints;
export const MainBreakpointStatuses: MediaBreakpointStatuses;

export function addResizeListener(element: any, listener: any): void;
export function removeResizeListener(element: any, listener: any): void;










export const AuxPanelChangedEvent = "pipAuxPanelChanged";
export const AuxPanelStateChangedEvent = "pipAuxPanelStateChanged";
export const OpenAuxPanelEvent = "pipOpenAuxPanel";
export const CloseAuxPanelEvent = "pipCloseAuxPanel";
export class AuxPanelConfig {
    parts: any;
    classes: string[];
    state: any;
    type: string;
}
export interface IAuxPanelService {
    readonly config: AuxPanelConfig;
    readonly classes: string[];
    parts: any;
    state: any;
    isOpen(): boolean;
    open(): void;
    close(): void;
    toggle(): void;
    addClass(...classes: string[]): void;
    removeClass(...classes: string[]): void;
    part(part: string, value: any): void;
}
export interface IAuxPanelProvider extends ng.IServiceProvider {
    config: AuxPanelConfig;
    parts: any;
    type: string;
    classes: string[];
    open(): void;
    close(): void;
    toggle(): void;
    addClass(...classes: string[]): void;
    removeClass(...classes: string[]): void;
    part(part: string, value: any): void;
}


}
