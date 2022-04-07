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
    start: (pressed: boolean) => void; // xbox start
    back: (pressed: boolean) => void; // xbox back
    LB: (pressed: boolean) => void; // xbox Left Bumper
    RB: (pressed: boolean) => void; // xbox Right Bumper
    LT: (pressed: boolean) => void; // xbox Left Trigger
    RT: (pressed: boolean) => void; // xbox Rigth trigger

    //
    connected: () => void;
}


export default class XBoxController extends GamePadController {
    constructor(options?: { mapping?: JoyPadMapping, serialNumber?: string, product?: RegExp, path?: RegExp, vendorId?: number, productId?: number }) {
        super({ ...options || {}, brand: 'xbox' });
    }

    public on = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.on(event, listener)
    public off = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.off(event, listener)
    public once = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.once(event, listener)
    public emit = <K extends keyof IEmissions>(event: K, ...args: Parameters<IEmissions[K]>): boolean => super.emit(event, ...args)
}