import EventEmitter from 'events';
import HID from 'node-hid';
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
  private dpadPos = [0x80, 0x80]; // X, Y

  // static 12 flags array
  private buttonStats: boolean[];
  private axisStat: {[ key: string ]: number[]};

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
    this.axisStat = {};
    for (const axis of this.mapping.axes) {
      if (!this.axisStat[axis.name]) {
        this.axisStat[axis.name] = [];
      }
      this.axisStat[axis.name][axis.pos || 0] = axis.rest || 0x80;
    }
  }

  public async start() {
    let hid: HID.HID | null = null;
    while (!hid) {
      let devices = HID.devices().filter(d => d.path);
      if (!this.serialNumber && !this.product && !this.path && !this.vendorId && !this.productId)
        devices = devices.filter(d => d.product && d.product.toLowerCase().includes('controller'));
      if (this.serialNumber) devices = devices.filter(d => d.serialNumber && d.serialNumber.includes(this.serialNumber));
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
    this.emit('raw', data);
    const { buttons, axes, dpadOffset, dpadBitShift, dpad } = this.mapping;
    // buttons
    for (let i = 0; i < buttons.length; i++) {
      const bt = buttons[i];
      const status = !!(data[bt.offset] & bt.mask);
      if (status != this.buttonStats[i]) {
        this.emit(bt.names[this.brand], status ? 0xff: 0);
        this.buttonStats[i] = status;
      }
    }
    // Annalogic Pad
    // const toEmit: {[key: string]: number[]} = {};
    const newAxis: {[ key: string ]: number[]} = {};
    for (const { name, pos, offset } of axes) {
      if (!newAxis[name]) {
        newAxis[name] = []
      }
      newAxis[name][pos || 0] = data[offset];
    }
    for (const name in newAxis) {
      const oldV = this.axisStat[name];
      const newV = newAxis[name];
      for (let i = 0; i < oldV.length; i++) {
        if (oldV[i] != newV[i]) {
          this.emit(name, ...newV);
          this.axisStat[name] = newV;
          break;
        }
      }
    }

    // Digital Pad
    const dpadState = data[dpadOffset] >> dpadBitShift;
    const dpadNewPos: [number, number] = (dpad as any)[dpadState];
    if (dpadNewPos && this.dpadPos != dpadNewPos) {
      this.dpadPos = dpadNewPos;
      this.emit('dpad', ...dpadNewPos);
    }
  }
}
