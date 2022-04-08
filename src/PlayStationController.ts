import { CommonEmissions } from "./data";
import GamePadController, {GamePadOptions} from "./GamePadController";

interface IEmissions extends CommonEmissions {
    // playstation / generic top buttons names 
    L1: (pressed: number) => void; // generic / playstaton Left Bumper
    R1: (pressed: number) => void; // generic / playstaton Right Bumper
    L2: (pressed: number) => void; // generic / playstaton Left trigger
    R2: (pressed: number) => void; // generic / playstaton Right trigger

    square: (pressed: number) => void; // Playastation Button
    cross: (pressed: number) => void; // Playastation Button
    circle: (pressed: number) => void; // Playastation Button
    triangle: (pressed: number) => void; // Playastation Button
    share: (pressed: number) => void; // Playstation share
    options: (pressed: number) => void; // Playstation options
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