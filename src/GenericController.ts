import { Device } from "node-hid";
import { JoyPadMapping } from "./data";
import GamePadController from "./GamePadController";


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

    // Generic button names
    BL: (pressed: boolean) => void; // Button left
    BD: (pressed: boolean) => void; // Button down
    BR: (pressed: boolean) => void; // Button Rigth
    BT: (pressed: boolean) => void; // Button Top
    // nintendo / xbox buttons names
    X: (pressed: boolean) => void; // nintendo / xbox X Button
    A: (pressed: boolean) => void; // nintendo / xbox A Button
    B: (pressed: boolean) => void; // nintendo / xbox B Button
    Y: (pressed: boolean) => void; // nintendo / xbox Y Button

    //
    L1: (pressed: boolean) => void; // generic / playstaton Left Bumper
    R1: (pressed: boolean) => void; // generic / playstaton Right Bumper
    L2: (pressed: boolean) => void; // generic / playstaton Left trigger
    R2: (pressed: boolean) => void; // generic / playstaton Right trigger

    BMR: (pressed: boolean) => void; // Button Middle Rigth
    BML: (pressed: boolean) => void; // Button Middle Left

    //
    connected: () => void;
}


export default class GenericController extends GamePadController {
    constructor(options?: { mapping?: JoyPadMapping, serialNumber?: string, product?: RegExp, path?: RegExp, vendorId?: number, productId?: number }) {
        super({ ...options || {}, brand: 'nintendo' });
    }

    public on = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.on(event, listener)
    public off = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.off(event, listener)
    public once = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.once(event, listener)
    public emit = <K extends keyof IEmissions>(event: K, ...args: Parameters<IEmissions[K]>): boolean => super.emit(event, ...args)
}