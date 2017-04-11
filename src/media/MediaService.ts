import { MediaBreakpoints, MediaBreakpointStatuses } from './IMediaService';
import { IMediaProvider } from './IMediaService';

export let MainBreakpoints = new MediaBreakpoints(639, 716, 1024, 1439);
export const MainBreakpointStatuses = new MediaBreakpointStatuses();

class MediaProvider implements IMediaProvider {
    public get breakpoints(): MediaBreakpoints {
        return MainBreakpoints;
    }

    public set breakpoints(value: MediaBreakpoints) {
        MainBreakpoints = value;
    }

    public $get() {
        const service = (size) => {
            return MainBreakpointStatuses[size];
        }

        Object.defineProperty(service, 'breakpoints', {
            get: () => { return MainBreakpoints; },
            set: (value) => { 
                MainBreakpoints = value || new MediaBreakpoints(639, 716, 1024, 1439);
                
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
    .module('pipMedia')
    .provider('pipMedia', MediaProvider);
