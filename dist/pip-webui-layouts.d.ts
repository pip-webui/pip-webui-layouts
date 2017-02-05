declare module pip.layouts {



<<<<<<< HEAD


=======
export let AuxPanelChangedEvent: string;
export let AuxPanelStateChangedEvent: string;
export let OpenAuxPanelEvent: string;
export let CloseAuxPanelEvent: string;
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
>>>>>>> dab61391caf42cc0f8e3d9fb2e4e3341cb2cfaf1



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



<<<<<<< HEAD
export let AuxPanelChangedEvent: string;
export let AuxPanelStateChangedEvent: string;
export let OpenAuxPanelEvent: string;
export let CloseAuxPanelEvent: string;
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
=======


>>>>>>> dab61391caf42cc0f8e3d9fb2e4e3341cb2cfaf1


}
