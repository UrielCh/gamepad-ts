import EventEmitter from 'events';
import HID from 'node-hid';
import { dualShock, ContollerBrand, JoyPadMapping } from './data';
import { promisify } from 'node:util';

interface IEmissions {
  error: (data: Error) => void;
  scan: (sns: Array<string>) => void;
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
  BMR: (pressed: boolean) => void; // Button Middle Rigth
  BML: (pressed: boolean) => void; // Button Middle Left

  // playstation / generic top buttons names 
  L1: (pressed: boolean) => void; // generic / playstaton Left Bumper
  R1: (pressed: boolean) => void; // generic / playstaton Right Bumper
  L2: (pressed: boolean) => void; // generic / playstaton Left trigger
  R2: (pressed: boolean) => void; // generic / playstaton Right trigger

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

  L: (pressed: boolean) => void; // nintendo L Button
  R: (pressed: boolean) => void; // nintendo R Button
  ZL: (pressed: boolean) => void; // nintendo Left Z
  ZR: (pressed: boolean) => void; // nintendo Rigth Z
  '+': (pressed: boolean) => void; // nintendo plus Button
  '-': (pressed: boolean) => void; // nintendo less Button
  // playstaion button names
  square: (pressed: boolean) => void; // Playastation Button
  cross: (pressed: boolean) => void; // Playastation Button
  circle: (pressed: boolean) => void; // Playastation Button
  triangle: (pressed: boolean) => void; // Playastation Button
  share: (pressed: boolean) => void; // Playstation share
  options: (pressed: boolean) => void; // Playstation options
  //
  connected: () => void;
}

export default class GamePadController extends EventEmitter {
  private serialNumber = '';
  private brand: ContollerBrand;
  private mapping: JoyPadMapping;

  //   hid?: HID.HID;

  private LStick = [0x80, 0x80]; // X, Y
  private RStick = [0x80, 0x80]; // X, Y
  private dpadPos = [0x80, 0x80]; // X, Y

  // static 12 flags array
  private buttonStats = [!!0, !!0, !!0, !!0, !!0, !!0, !!0, !!0, !!0, !!0, !!0, !!0]

  public on = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.on(event, listener)
  public off = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.off(event, listener)
  public once = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => super.once(event, listener)
  public emit = <K extends keyof IEmissions>(event: K, ...args: Parameters<IEmissions[K]>): boolean => super.emit(event, ...args)

  constructor(options?: { brand?: ContollerBrand, serialNumber?: string, mapping?: JoyPadMapping }) {
    super();
    options = options || {};
    if (options.serialNumber) {
      this.serialNumber = options.serialNumber.toUpperCase();
    }
    this.brand = options.brand || 'xbox';
    this.mapping = options.mapping || dualShock;
  }

  public async start() {
    let hid: HID.HID | null = null;
    while (!hid) {
      let devices = HID.devices().filter(d => d.path);
      if (this.serialNumber)
        devices = devices.filter(d => d.serialNumber && d.serialNumber.includes(this.serialNumber));
      else
        devices = devices.filter(d => d.product && d.product.toLowerCase().includes('controller'));
      this.emit('scan', devices.map(d => d.serialNumber as string));
      if (devices.length == 1) {
        const d = devices[0];
        try {
          hid = new HID.HID(d.path as string);
          break;
        } catch (ex) {
          this.emit('error', Error(`${ex}`));
        }
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    this.emit('connected');
    const read = promisify(hid.read.bind(hid));
    try {
      for (;;) {
        const data: any = await read()
        this.digest(data as Buffer);
      }
    } catch (ex) {
      this.emit('error', Error(`${ex}`));
    }
  };

  private digest(data: Buffer): void {
    const { buttons, axes, dpadOffset, dpadBitShift, dpad } = this.mapping;
    // buttons
    for (let i = 0; i < buttons.length; i++) {
      const bt = buttons[i];
      const status = !!(data[bt.offset] & bt.mask);
      if (status != this.buttonStats[i]) {
        this.emit(bt.names[this.brand], status);
        this.buttonStats[i] = status;
      }
    }
    // Annalogic Pad
    for (const name of Object.keys(axes) as Array<'LStick' | 'RStick'>) {
      const stick = axes[name];
      const current = [data[stick[0]], data[stick[1]]] as [number, number];
      const previous = this[name];
      if (previous[0] !== current[0] || previous[1] !== current[1]) {
        this[name] = current;
        this.emit(name, current);
      }
    }
    // Digital Pad
    const dpadState = data[dpadOffset] >> dpadBitShift;
    const dpadNewPos: [number, number] = (dpad as any)[dpadState];
    if (dpadNewPos && this.dpadPos != dpadNewPos) {
      this.dpadPos = dpadNewPos;
      this.emit('dpad', dpadNewPos);
    }
  }
}
