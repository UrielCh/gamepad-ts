import { Device } from "node-hid";

export const xboxButton = ['X', 'A', 'B', 'Y', 'start', 'back', 'LStickBt', 'RStickBt', 'LB', 'RB', 'LT', 'RT'] as const;
export const nintendoButton = ['Y', 'B', 'A', 'X', '+', '-', 'LStickBt', 'RStickBt', 'L', 'R', 'ZL', 'ZR'] as const;
export const playStationButton = ['square', 'cross', 'circle', 'triangle', 'options', 'share', 'LStickBt', 'RStickBt', 'L1', 'R1', 'L2', 'R2'] as const;
export const genericButton = ['BL', 'BD', 'BR', 'BT', 'BMR', 'BML', 'LStickBt', 'RStickBt', 'L1', 'R1', 'L2', 'R2'] as const;

export type xboxBtTypes = typeof xboxButton[number];
export type nintendoBtTypes = typeof nintendoButton[number];
export type playstyationTypes = typeof playStationButton[number];
export type genericBtTypes = typeof genericButton[number];


export interface ButtonsNames {
    xbox: xboxBtTypes;
    nintendo: nintendoBtTypes;
    playStation: playstyationTypes;
    generic: genericBtTypes;
}

export type ContollerBrand = 'xbox' | 'nintendo' | 'playStation' | 'generic';

export const ALL_BUTTONS: { [key: string]: ButtonsNames } = {
    BL: { xbox: 'X', nintendo: 'Y', playStation: 'square', generic: 'BL' },
    BD: { xbox: 'A', nintendo: 'B', playStation: 'cross', generic: 'BD' },
    BR: { xbox: 'B', nintendo: 'A', playStation: 'circle', generic: 'BR' },
    BT: { xbox: 'Y', nintendo: 'X', playStation: 'triangle', generic: 'BT' },
    // special Buttons
    BMR: { xbox: 'start', nintendo: '+', playStation: 'options', generic: 'BMR' },
    BML: { xbox: 'back', nintendo: '-', playStation: 'share', generic: 'BML' },
    // annalogic stick buttons
    LStickBt: { xbox: 'LStickBt', nintendo: 'LStickBt', playStation: 'LStickBt', generic: 'LStickBt' },
    RStickBt: { xbox: 'RStickBt', nintendo: 'RStickBt', playStation: 'RStickBt', generic: 'RStickBt' },
    // top buttons
    L1: { xbox: 'LB', nintendo: 'L', playStation: 'L1', generic: 'L1' },
    R1: { xbox: 'RB', nintendo: 'R', playStation: 'R1', generic: 'R1' },
    L2: { xbox: 'LT', nintendo: 'ZL', playStation: 'L2', generic: 'L2' }, // can be annalogic
    R2: { xbox: 'RT', nintendo: 'ZR', playStation: 'R2', generic: 'R2' },
}

export interface JoyPadMapping {
    axes: Array<{offset: number, rest?: number, name: string, pos?: number}>,
    buttons: Array<{ offset: number, mask: number, names: ButtonsNames }>,
    dpadOffset: number,
    dpadBitShift: number,
    dpad: { [key: number]: [number, number] },

}

export const dualShock: JoyPadMapping = {
    // 0-255 1 byte value
    axes: [
        { offset: 3, rest: 0x80, name: 'LStick', pos: 0 },
        { offset: 4, rest: 0x80, name: 'LStick', pos: 1 },
        { offset: 5, rest: 0x80, name: 'RStick', pos: 0 },
        { offset: 6, rest: 0x80, name: 'RStick', pos: 1 },
    ],
    buttons: [
        { offset: 7, mask: 0x10, names: ALL_BUTTONS.BL }, // BT left
        { offset: 7, mask: 0x20, names: ALL_BUTTONS.BD }, // BT down
        { offset: 7, mask: 0x40, names: ALL_BUTTONS.BR }, // BT right
        { offset: 7, mask: 0x80, names: ALL_BUTTONS.BT }, // BT top
        { offset: 8, mask: 0x10, names: ALL_BUTTONS.BMR }, // plus
        { offset: 8, mask: 0x20, names: ALL_BUTTONS.BML }, // minus
        { offset: 8, mask: 0x40, names: ALL_BUTTONS.LStickBt }, // ZL
        { offset: 8, mask: 0x80, names: ALL_BUTTONS.RStickBt }, // ZR
        { offset: 8, mask: 0x01, names: ALL_BUTTONS.L1 },
        { offset: 8, mask: 0x02, names: ALL_BUTTONS.R1 },
        { offset: 8, mask: 0x04, names: ALL_BUTTONS.L2 },
        { offset: 8, mask: 0x08, names: ALL_BUTTONS.R2 },
    ],
    dpadOffset: 7,
    dpadBitShift: 0,
    dpad: {
        0b0000: [0x80, 0xFF], //       up
        0b0001: [0xFF, 0xFF], // right up
        0b0010: [0xFF, 0x80], // right
        0b0011: [0xFF, 0x00], // right down
        0b0100: [0x80, 0x00], //       down
        0b0101: [0x00, 0x00], // left  down 
        0b0110: [0x00, 0x80], // left
        0b0111: [0x00, 0xFF], // left  up 
        0b1000: [0x80, 0x80], // neutral
    }
}

export interface CommonEmissions {
    error: (data: Error) => void;
    scan: (sns: Array<Device>) => void;
    connected: () => void;
    // common events
    LStick: (x: number, y: number) => void; // Left stick moved event (x, y)
    RStick: (x: number, y: number) => void; // Right stick moved event (x, y)
    dpad: (x: number, y: number) => void; // Digital Pad change event (x, y)

    // common button names 
    LStickBt: (pressed: boolean) => void; // Left stick press
    RStickBt: (pressed: boolean) => void; // Right stick press
    // raw data emited, usefull for debug
    raw: (buffer: Buffer) => void;
}