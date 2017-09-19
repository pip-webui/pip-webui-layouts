export const AuxPanelChangedEvent = 'pipAuxPanelChanged';
export const AuxPanelStateChangedEvent = 'pipAuxPanelStateChanged';
export const OpenAuxPanelEvent = 'pipOpenAuxPanel';
export const CloseAuxPanelEvent = 'pipCloseAuxPanel';
export const AuxPanelOpenedEvent = 'pipAuxPanelOpened';
export const AuxPanelClosedEvent = 'pipAuxPanelClosed';

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