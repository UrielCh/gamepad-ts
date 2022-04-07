import EventEmitter from 'events';
import HID, { Device } from 'node-hid';
import { dualShock, ContollerBrand, JoyPadMapping } from './data';
import { promisify } from 'node:util';


export interface GamePadOptions {
  mapping?: JoyPadMapping;
  serialNumber?: string;
  product?: RegExp;
  path?: RegExp;
  vendorId?: number;
  productId?: number;
}

export default class GamePadController extends EventEmitter {
  private serialNumber = '';
  private brand: ContollerBrand;
  private mapping: JoyPadMapping;
  private product?: RegExp;
  private path?: RegExp;
  private vendorId?: number;
  private productId?: number;

  //   hid?: HID.HID;

  private LStick = [0x80, 0x80]; // X, Y
  private RStick = [0x80, 0x80]; // X, Y
  private dpadPos = [0x80, 0x80]; // X, Y

  // static 12 flags array
  private buttonStats: boolean[];

  constructor(options?: { brand?: ContollerBrand, mapping?: JoyPadMapping, serialNumber?: string, product?: RegExp, path?: RegExp, vendorId?: number, productId?: number }) {
    super();
    options = options || {};
    this.serialNumber = (options.serialNumber || '').toUpperCase();
    this.product = options.product;
    this.path = options.path;
    this.vendorId = options.vendorId;
    this.productId = options.productId;
    this.brand = options.brand || 'xbox';
    this.mapping = options.mapping || dualShock;
    this.buttonStats = new Array(this.mapping.buttons.length).fill(false);
  }

  public async start() {
    let hid: HID.HID | null = null;
    while (!hid) {
      let devices = HID.devices().filter(d => d.path);
      if (this.serialNumber) devices = devices.filter(d => d.serialNumber && d.serialNumber.includes(this.serialNumber));
      //  devices = devices.filter(d => d.product && d.product.toLowerCase().includes('controller'));
      if (this.product) devices = devices.filter(d => d.product && (this.product as RegExp).test(d.product));
      if (this.path) devices = devices.filter(d => d.path && (this.path as RegExp).test(d.path));
      if (this.vendorId) devices = devices.filter(d => d.vendorId && d.vendorId === this.vendorId);
      if (this.productId) devices = devices.filter(d => d.productId && d.productId === this.productId);
      this.emit('scan', devices);
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
