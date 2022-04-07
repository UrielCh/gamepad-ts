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

    // nintendo / xbox buttons names
    X: (pressed: boolean) => void; // nintendo / xbox X Button
    A: (pressed: boolean) => void; // nintendo / xbox A Button
    B: (pressed: boolean) => void; // nintendo / xbox B Button
    Y: (pressed: boolean) => void; // nintendo / xbox Y Button

    //
    L: (pressed: boolean) => void; // nintendo L Button
    R: (pressed: boolean) => void; // nintendo R Button
    ZL: (pressed: boolean) => void; // nintendo Left Z
    ZR: (pressed: boolean) => void; // nintendo Rigth Z
    '+': (pressed: boolean) => void; // nintendo plus Button
    '-': (pressed: boolean) => void; // nintendo less Button

    //
    connected: () => void;
}


export default class NintendoController extends GamePadController {
    constructor(options?: { mapping?: JoyPadMapping, serialNumber?: string, product?: RegExp, path?: RegExp, vendorId?: number, productId?: number }) {
        super({ ...options || {}, brand: 'nintendo' });
    }

    public on = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.on(event, listener)
    public off = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.off(event, listener)
    public once = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.once(event, listener)
    public emit = <K extends keyof IEmissions>(event: K, ...args: Parameters<IEmissions[K]>): boolean => super.emit(event, ...args)
}