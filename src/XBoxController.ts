import { CommonEmissions, JoyPadMapping } from "./data";
import GamePadController from "./GamePadController";

interface IEmissions extends CommonEmissions {
    // nintendo / xbox buttons names
    X: (pressed: number) => void; // nintendo / xbox X Button
    A: (pressed: number) => void; // nintendo / xbox A Button
    B: (pressed: number) => void; // nintendo / xbox B Button
    Y: (pressed: number) => void; // nintendo / xbox Y Button

    start: (pressed: number) => void; // xbox start
    back: (pressed: number) => void; // xbox back
    LB: (pressed: number) => void; // xbox Left Bumper
    RB: (pressed: number) => void; // xbox Right Bumper
    LT: (pressed: number) => void; // xbox Left Trigger
    RT: (pressed: number) => void; // xbox Rigth trigger
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