'use strict';

export let AuxPanelChangedEvent = 'pipAuxPanelChanged';
export let AuxPanelStateChangedEvent = 'pipAuxPanelStateChanged';
export let OpenAuxPanelEvent = 'pipOpenAuxPanel';
export let CloseAuxPanelEvent = 'pipCloseAuxPanel';

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

class AuxPanelService implements IAuxPanelService {
    private _config: AuxPanelConfig;
    private _state: any;
    private _rootScope: ng.IRootScopeService;
    private _sidenav: ng.material.ISidenavService;
    private id = 'pip-auxpanel';

    public constructor(config: AuxPanelConfig, $rootScope: ng.IRootScopeService, $mdSidenav: ng.material.ISidenavService) {
        this._config = config;
        this._rootScope = $rootScope;
        this._sidenav = $mdSidenav;
    }

    public get config(): AuxPanelConfig {
        return this._config;
    }

    public get classes(): string[] {
        return this._config.classes;
    }

    public get parts(): any {
        return this._config.parts;
    }

    public set parts(value: any) {
        this._config.parts = value || {};
        this.sendConfigEvent();
    }

    public get state(): any {
        return this._state;
    }

    public set state(value: any) {
        this._state = value || {};
        this._rootScope.$broadcast(AuxPanelStateChangedEvent, value);
    }

    public isOpen(): boolean {
        return this._sidenav(this.id).isOpen();
    }

    public open() {
        this._sidenav(this.id).open();
    }
            
    public close() {
        this._sidenav(this.id).close();
    }

    public toggle() {
        this._sidenav(this.id).toggle();
    }
  
    public addClass(...classes: string[]): void {
        _.each(classes, (c) => {
            this._config.classes.push(c);
        });
        this.sendConfigEvent();
    }

    public removeClass(...classes: string[]): void {
        _.each(classes, (c) => {
            this._config.classes = _.reject(this._config.classes, (cc) => cc == c);
        });
        this.sendConfigEvent();
    }
 
    public part(part: string, value: any): void {
        this._config.parts[part] = value;
        this.sendConfigEvent();
    }

    private sendConfigEvent() {
        this._rootScope.$emit(AuxPanelChangedEvent, this._config);
    }
}

class AuxPanelProvider implements IAuxPanelProvider {
    private _config: AuxPanelConfig = {
        parts: {},
        classes: [],
        type: 'sticky',
        state: null
    };

    private _service: AuxPanelService;

    public get config(): AuxPanelConfig {
        return this._config;
    }

    public set config(value: AuxPanelConfig) {
        this._config = value || new AuxPanelConfig();
    }

    public get parts(): any {
        return this._config.parts;
    }

    public set parts(value: any) {
        this._config.parts = value || {};
    }

    public get type(): string {
        return this._config.type;
    }

    public set type(value: string) {
        this._config.type = value;
    }

    public get classes(): string[] {
        return this._config.classes;
    }

    public set classes(value: string[]) {
        this._config.classes = value || [];
    }

    public addClass(...classes: string[]): void {
        _.each(classes, (c) => {
            this._config.classes.push(c);
        });
    }

    public removeClass(...classes: string[]): void {
        _.each(classes, (c) => {
            this._config.classes = _.reject(this._config.classes, (cc) => cc == c);
        });
    }
 
    public part(part: string, value: any): void {
        this._config.parts[part] = value;
    }

    public open(): void {
        this._service.open();
    }

    public close(): void {
        this._service.close();
    }

    public toggle(): void {
        this._service.toggle();
    }

    public $get($rootScope: ng.IRootScopeService, $mdSidenav: ng.material.ISidenavService) {
        "ngInject";

        if (this._service == null)
            this._service = new AuxPanelService(this._config, $rootScope, $mdSidenav);

        return this._service;
    }     
}

function hookAuxPanelEvents($rootScope: ng.IRootScopeService, pipAuxPanel: IAuxPanelService) {
    $rootScope.$on(OpenAuxPanelEvent, () => { pipAuxPanel.open(); });
    $rootScope.$on(CloseAuxPanelEvent, () => { pipAuxPanel.close(); });
}

angular
    .module('pipAuxPanel')
    .provider('pipAuxPanel', AuxPanelProvider)
    .run(hookAuxPanelEvents);
