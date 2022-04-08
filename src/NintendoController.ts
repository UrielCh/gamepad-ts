import { CommonEmissions, JoyPadMapping } from "./data";
import GamePadController from "./GamePadController";

interface IEmissions extends CommonEmissions {
    // nintendo / xbox buttons names
    X: (pressed: number) => void; // nintendo / xbox X Button
    A: (pressed: number) => void; // nintendo / xbox A Button
    B: (pressed: number) => void; // nintendo / xbox B Button
    Y: (pressed: number) => void; // nintendo / xbox Y Button

    L: (pressed: number) => void; // nintendo L Button
    R: (pressed: number) => void; // nintendo R Button
    ZL: (pressed: number) => void; // nintendo Left Z
    ZR: (pressed: number) => void; // nintendo Rigth Z
    '+': (pressed: number) => void; // nintendo plus Button
    '-': (pressed: number) => void; // nintendo less Button
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