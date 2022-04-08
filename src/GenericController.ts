import { CommonEmissions, JoyPadMapping } from "./data";
import GamePadController from "./GamePadController";

interface IEmissions extends CommonEmissions {
    // Generic button names
    BL: (pressed: number) => void; // Button left
    BD: (pressed: number) => void; // Button down
    BR: (pressed: number) => void; // Button Rigth
    BT: (pressed: number) => void; // Button Top

    L1: (pressed: number) => void; // generic / playstaton Left Bumper
    R1: (pressed: number) => void; // generic / playstaton Right Bumper
    L2: (pressed: number) => void; // generic / playstaton Left trigger
    R2: (pressed: number) => void; // generic / playstaton Right trigger
    BMR: (pressed: number) => void; // Button Middle Rigth
    BML: (pressed: number) => void; // Button Middle Left
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