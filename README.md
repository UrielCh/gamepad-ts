# gamepad-ts

Gamepad-ts is a heavily typed Typescript gamepad contol library.

It will detect and connect an USB contoller, and send corresponding events.

This code had been test with [DS4Windows](https://github.com/Ryochan7/DS4Windows)

## usage

- it you want to use your gamepad as a `nintendo` contoler:

```typescript
import { NintendoController } from 'gamepad-ts'

const pad = new NintendoController();

pad.on('LStick', (pos: [number, number]) => {}); // Left stick moved event (x, y)
pad.on('RStick', (pos: [number, number]) => {}); // Right stick moved event (x, y)
pad.on('dpad', (pos: [number, number]) => {}); // Digital Pad change event (x, y)
pad.on('LStickBt', (pressed: boolean) => {}); // Left stick press
pad.on('RStickBt', (pressed: boolean) => {}); // Right stick press
pad.on('X', (pressed: boolean) => {}); // nintendo / xbox X Button
pad.on('A', (pressed: boolean) => {}); // nintendo / xbox A Button
pad.on('B', (pressed: boolean) => {}); // nintendo / xbox B Button
pad.on('Y', (pressed: boolean) => {}); // nintendo / xbox Y Button
pad.on('+', (pressed: boolean) => {}); // nintendo plus Button
pad.on('-', (pressed: boolean) => {}); // nintendo less Button
pad.on('L', (pressed: boolean) => {}); // nintendo L Button
pad.on('R', (pressed: boolean) => {}); // nintendo R Button
pad.on('ZL', (pressed: boolean) => {}); // nintendo Left Z
pad.on('ZR', (pressed: boolean) => {}); // nintendo Rigth Z

```

- it you want to use your game pad as a `xbox` contoler"

```typescript
import { XBoxController } from 'gamepad-ts'

const pad = new XBoxController();

pad.on('LStick', (pos: [number, number]) => {}); // Left stick moved event (x, y)
pad.on('RStick', (pos: [number, number]) => {}); // Right stick moved event (x, y)
pad.on('dpad', (pos: [number, number]) => {}); // Digital Pad change event (x, y)
pad.on('LStickBt', (pressed: boolean) => {}); // Left stick press
pad.on('RStickBt', (pressed: boolean) => {}); // Right stick press
pad.on('X', (pressed: boolean) => {}); // nintendo / xbox X Button
pad.on('A', (pressed: boolean) => {}); // nintendo / xbox A Button
pad.on('B', (pressed: boolean) => {}); // nintendo / xbox B Button
pad.on('Y', (pressed: boolean) => {}); // nintendo / xbox Y Button
pad.on('start', (pressed: boolean) => {}); // xbox start
pad.on('back', (pressed: boolean) => {}); // xbox back
pad.on('LB', (pressed: boolean) => {}); // xbox Left Bumper
pad.on('RB', (pressed: boolean) => {}); // xbox Right Bumper
pad.on('LT', (pressed: boolean) => {}); // xbox Left Trigger
pad.on('RT', (pressed: boolean) => {}); // xbox Rigth trigger
```

- it you want to use your game pad as a `playstation` contoler"

```typescript
import { PlayStationController } from 'gamepad-ts'

const pad = new PlayStationController();

pad.on('LStick', (pos: [number, number]) => {}); // Left stick moved event (x, y)
pad.on('RStick', (pos: [number, number]) => {}); // Right stick moved event (x, y)
pad.on('dpad', (pos: [number, number]) => {}); // Digital Pad change event (x, y)
pad.on('LStickBt', (pressed: boolean) => {}); // Left stick press
pad.on('RStickBt', (pressed: boolean) => {}); // Right stick press
pad.on('square', (pressed: boolean) => {}); // Playastation Button
pad.on('cross', (pressed: boolean) => {}); // Playastation Button
pad.on('circle', (pressed: boolean) => {}); // Playastation Button
pad.on('triangle', (pressed: boolean) => {}); // Playastation Button
pad.on('share', (pressed: boolean) => {}); // Playstation share
pad.on('options', (pressed: boolean) => {}); // Playstation options
pad.on('L1', (pressed: boolean) => {}); // playstaton Left Button
pad.on('R1', (pressed: boolean) => {}); // playstaton Right Button
pad.on('L2', (pressed: boolean) => {}); // playstaton Left trigger
pad.on('R2', (pressed: boolean) => {}); // playstaton Right trigger
```

- it you want to use your game pad as a `generic` contoler"

```typescript
import { GenericController } from 'gamepad-ts'

const pad = new GenericController();

pad.on('LStick', (pos: [number, number]) => {}); // Left stick moved event (x, y)
pad.on('RStick', (pos: [number, number]) => {}); // Right stick moved event (x, y)
pad.on('dpad', (pos: [number, number]) => {}); // Digital Pad change event (x, y)
pad.on('LStickBt', (pressed: boolean) => {}); // Left stick press
pad.on('RStickBt', (pressed: boolean) => {}); // Right stick press
pad.on('BL', (pressed: boolean) => {}); // Button left
pad.on('BD', (pressed: boolean) => {}); // Button down
pad.on('BR', (pressed: boolean) => {}); // Button Rigth
pad.on('BT', (pressed: boolean) => {}); // Button Top
pad.on('BMR', (pressed: boolean) => {}); // Button Middle Rigth
pad.on('BML', (pressed: boolean) => {}); // Button Middle Left
pad.on('L1', (pressed: boolean) => {}); // generic / playstaton Left Bumper
pad.on('R1', (pressed: boolean) => {}); // generic / playstaton Right Bumper
pad.on('L2', (pressed: boolean) => {}); // generic / playstaton Left trigger
pad.on('R2', (pressed: boolean) => {}); // generic / playstaton Right trigger
```

Note:

- `X` `Y` `A` `B` are differently mapped on Nintendo and XBox, So it's inportant to choose the correct mapping.
- Analogic pad and digital pad values are all [0-255] value, so any resting pad value will be [128, 128]

## usage code

```typescript
import PlayStationController from './src/index';
const ctrl = new PlayStationController();
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
