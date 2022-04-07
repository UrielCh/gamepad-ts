import { Device } from "node-hid";
import GamePadController, {GamePadOptions} from "./GamePadController";


interface IEmissions {
    error: (data: Error) => void;
    scan: (sns: Array<Device>) => void;
    // common events
    LStick: (pos: [number, number]) => void; // Left stick moved event (x, y)
    RStick: (pos: [number, number]) => void; // Right stick moved event (x, y)
    dpad: (pos: [number, number]) => void; // Digital Pad change event (x, y)

    // common button names 
    LStickBt: (pressed: boolean) => void; // Left stick press
    RStickBt: (pressed: boolean) => void; // Right stick press

    // playstation / generic top buttons names 
    L1: (pressed: boolean) => void; // generic / playstaton Left Bumper
    R1: (pressed: boolean) => void; // generic / playstaton Right Bumper
    L2: (pressed: boolean) => void; // generic / playstaton Left trigger
    R2: (pressed: boolean) => void; // generic / playstaton Right trigger

    square: (pressed: boolean) => void; // Playastation Button
    cross: (pressed: boolean) => void; // Playastation Button
    circle: (pressed: boolean) => void; // Playastation Button
    triangle: (pressed: boolean) => void; // Playastation Button
    share: (pressed: boolean) => void; // Playstation share
    options: (pressed: boolean) => void; // Playstation options

    //
    connected: () => void;
}


export default class PlaystationController extends GamePadController {
    constructor(options?: GamePadOptions) {
        super({ ...options || {}, brand: 'playStation' });
    }

    public on = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.on(event, listener)
    public off = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.off(event, listener)
    public once = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.once(event, listener)
    public emit = <K extends keyof IEmissions>(event: K, ...args: Parameters<IEmissions[K]>): boolean => super.emit(event, ...args)
}