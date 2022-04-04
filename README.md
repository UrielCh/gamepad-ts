# gamepad-ts

Gamepad-ts is a heavily typed gamepad contol reciever.

It will detect and connect an USB contoller, and send corresponding events.

This code had been test with [DS4Windows](https://github.com/Ryochan7/DS4Windows)

## usage

On creation you hae to choose the gamepad model you want to see.

- it you choose `nintendo`, the controller will emit events the following events:

```typescript
  LStick: (pos: [number, number]) => void; // Left stick moved event (x, y)
  RStick: (pos: [number, number]) => void; // Right stick moved event (x, y)
  dpad: (pos: [number, number]) => void; // Digital Pad change event (x, y)
  LStickBt: (pressed: boolean) => void; // Left stick press
  RStickBt: (pressed: boolean) => void; // Right stick press

  X: (pressed: boolean) => void; // nintendo / xbox X Button
  A: (pressed: boolean) => void; // nintendo / xbox A Button
  B: (pressed: boolean) => void; // nintendo / xbox B Button
  Y: (pressed: boolean) => void; // nintendo / xbox Y Button
  '+': (pressed: boolean) => void; // nintendo plus Button
  '-': (pressed: boolean) => void; // nintendo less Button
  L: (pressed: boolean) => void; // nintendo L Button
  R: (pressed: boolean) => void; // nintendo R Button
  ZL: (pressed: boolean) => void; // nintendo Left Z
  ZR: (pressed: boolean) => void; // nintendo Rigth Z
```

- it you choose `xbox`, the controller will emit events the following events:

```typescript
  LStick: (pos: [number, number]) => void; // Left stick moved event (x, y)
  RStick: (pos: [number, number]) => void; // Right stick moved event (x, y)
  dpad: (pos: [number, number]) => void; // Digital Pad change event (x, y)
  LStickBt: (pressed: boolean) => void; // Left stick press
  RStickBt: (pressed: boolean) => void; // Right stick press

  X: (pressed: boolean) => void; // nintendo / xbox X Button
  A: (pressed: boolean) => void; // nintendo / xbox A Button
  B: (pressed: boolean) => void; // nintendo / xbox B Button
  Y: (pressed: boolean) => void; // nintendo / xbox Y Button
  start: (pressed: boolean) => void; // xbox start
  back: (pressed: boolean) => void; // xbox back
  LB: (pressed: boolean) => void; // xbox Left Bumper
  RB: (pressed: boolean) => void; // xbox Right Bumper
  LT: (pressed: boolean) => void; // xbox Left Trigger
  RT: (pressed: boolean) => void; // xbox Rigth trigger
```

- it you choose `playstation`, the controller will emit events the following events:

```typescript
  LStick: (pos: [number, number]) => void; // Left stick moved event (x, y)
  RStick: (pos: [number, number]) => void; // Right stick moved event (x, y)
  dpad: (pos: [number, number]) => void; // Digital Pad change event (x, y)
  LStickBt: (pressed: boolean) => void; // Left stick press
  RStickBt: (pressed: boolean) => void; // Right stick press

  square: (pressed: boolean) => void; // Playastation Button
  cross: (pressed: boolean) => void; // Playastation Button
  circle: (pressed: boolean) => void; // Playastation Button
  triangle: (pressed: boolean) => void; // Playastation Button
  share: (pressed: boolean) => void; // Playstation share
  options: (pressed: boolean) => void; // Playstation options
  L1: (pressed: boolean) => void; // playstaton Left Button
  R1: (pressed: boolean) => void; // playstaton Right Button
  L2: (pressed: boolean) => void; // playstaton Left trigger
  R2: (pressed: boolean) => void; // playstaton Right trigger
```

- it you choose `generic`, the controller will emit events the following events:

```typescript
  LStick: (pos: [number, number]) => void; // Left stick moved event (x, y)
  RStick: (pos: [number, number]) => void; // Right stick moved event (x, y)
  dpad: (pos: [number, number]) => void; // Digital Pad change event (x, y)
  LStickBt: (pressed: boolean) => void; // Left stick press
  RStickBt: (pressed: boolean) => void; // Right stick press

  BL: (pressed: boolean) => void; // Button left
  BD: (pressed: boolean) => void; // Button down
  BR: (pressed: boolean) => void; // Button Rigth
  BT: (pressed: boolean) => void; // Button Top
  BMR: (pressed: boolean) => void; // Button Middle Rigth
  BML: (pressed: boolean) => void; // Button Middle Left

  L1: (pressed: boolean) => void; // generic / playstaton Left Bumper
  R1: (pressed: boolean) => void; // generic / playstaton Right Bumper
  L2: (pressed: boolean) => void; // generic / playstaton Left trigger
  R2: (pressed: boolean) => void; // generic / playstaton Right trigger
```

Note:

- `X` `Y` `A` `B` are differently mapped on Nintendo and XBox, So it's inportant to choose the correct mapping.
- Analogic pad and digital pad values are all [0-255] value, so any resting pad value will be [128, 128]

## usage code

```typescript
import GamePadController from './src/index';
const ctrl = new GamePadController({brand: 'playStation'});
/*
 * A,B,X,Y buttons
 */
ctrl.on('LStick', (pos) => console.log(`L: ${pos[0]}, ${pos[1]}`));
ctrl.on('RStick', (pos) => console.log(`R: ${pos[0]}, ${pos[1]}`));
ctrl.on('dpad', (pos) => console.log(`dPad: ${pos[0]}, ${pos[1]}`));
ctrl.on('square', (pressed: boolean) => console.log('square: ' + pressed));
ctrl.on('cross', (pressed: boolean) => console.log('cross: ' + pressed));
ctrl.on('circle', (pressed: boolean) => console.log('circle: ' + pressed));
ctrl.on('triangle', (pressed: boolean) => console.log('triangle: ' + pressed));
/*
 * Setup
 */
ctrl.on('connected', () => console.log('Xbox controller connected'));
ctrl.on('error', (err) => console.error(err));
ctrl.start();
```

## TODO

- add calibration code to add new devices.
- add Gyroscope.
