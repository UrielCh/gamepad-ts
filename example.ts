import { PlayStationController, JoyPadMapping, ALL_BUTTONS } from './src/index';
import pc from 'picocolors';
// const ctrl = new PlayStationController({vendorId:  1356, productId: 2508});

import { throttle } from 'throttle-debounce';
import { dualShockUSB } from './src/data';

/*
 * A,B,X,Y buttons
 */
// ctrl.on('LStick', (pos) => console.log(`L: ${pos[0]}, ${pos[1]}`));
// ctrl.on('RStick', (pos) => console.log(`R: ${pos[0]}, ${pos[1]}`));
// ctrl.on('dpad', (pos) => console.log(`dPad: ${pos[0]}, ${pos[1]}`));
// ctrl.on('square', (pressed: boolean) => console.log('square: ' + pressed));
// ctrl.on('cross', (pressed: boolean) => console.log('cross: ' + pressed));
// ctrl.on('circle', (pressed: boolean) => console.log('circle: ' + pressed));
// ctrl.on('triangle', (pressed: boolean) => console.log('triangle: ' + pressed));
/*
 * Setup
 */
// ctrl.on('connected', () => console.log('Xbox controller connected'));
// ctrl.on('error', (err) => console.error(err));
// ctrl.on('scan', (devices) => console.log(devices));

const print = throttle(50, (txt: string) => {console.log(txt)});

//const ctrl = new PlayStationController({vendorId: 1118, productId: 654, mapping: dualShockUSB});
const ctrl = new PlayStationController({ mapping: dualShockUSB});
ctrl.on('scan', (devices) => console.log(devices));
ctrl.on('error', (err) => console.error(err));

let prev = '';
ctrl.on('raw', (data) => {
    // Hexa:
    // .subarray(0, 48)
    const sub = data.subarray(25, 34);
    let txt = sub.toString('hex').replace(/(..)/g, '$1 ');
    txt = txt.replace(/([0-9a-f ]{11} )/g, '$1 ');
    txt = `${data.length}- ${txt}`;
    // let txt = (data[11] >> 2).toString(2).padStart(6, '0').substring(2)
    // txt = '0b' + txt;

    if (!prev) {
        prev = txt;
    }
    if (prev !== txt) {
        let out = '';
        for (let i = 0; i < txt.length; i++) {
            if (prev[i] !== txt[i]) {
                out += pc.green(txt[i]);
            } else {
                out += txt[i];
            }
        }
        // print(out);
        prev = txt;
    }
});

// ctrl.on('share', (val) => console.log('share', val));
// ctrl.on('options', (val) => console.log('options', val));
// ctrl.on('LStickBt', (val) => console.log('share', val));
// ctrl.on('RStickBt', (val) => console.log('options', val));
// ctrl.on('L1', (val) => console.log('L1:', val));
// ctrl.on('R1', (val) => console.log('R1:', val));
// ctrl.on('L2', (val) => console.log('L2:', val));
// ctrl.on('R2', (val) => console.log('R2:', val));
ctrl.on('LStick', (x, y) => console.log('LStick:', x, y));
ctrl.on('RStick', (x, y) => console.log('RStick:', x, y));

//ctrl.on('dpad', (x,y) => console.log('dpad:', x, y));
//ctrl.on('circle', (val) => console.log('circle:', val));
//ctrl.on('square', (val) => console.log('square:', val));
//ctrl.on('triangle', (val) => console.log('triangle:', val));
//ctrl.on('cross', (val) => console.log('cross:', val));

// ctrl.on('raw', (data) => console.log(data.subarray(8, 12).toString('hex').replace(/(..)/g, '$1 ')));

ctrl.start();
