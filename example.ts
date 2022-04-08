import { PlayStationController, JoyPadMapping, ALL_BUTTONS } from './src/index';
import pc from 'picocolors';
// const ctrl = new PlayStationController({vendorId:  1356, productId: 2508});

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


export const dualShockUSB: JoyPadMapping = {
    // 0-255 1 byte value
    axes: [
        { offset: 1, name: 'LStick', pos: 0 },
        { offset: 3, name: 'LStick', pos: 1 },
        { offset: 5, name: 'RStick', pos: 0 },
        { offset: 7, name: 'RStick', pos: 1 },
        { offset: 8, name: 'L1' }, // ZR
        { offset: 9, name: 'L2' }, // ZL
    ],
    buttons: [
        { offset: 10, mask: 0x04, names: ALL_BUTTONS.BL }, // BT left
        { offset: 10, mask: 0x01, names: ALL_BUTTONS.BD }, // BT down
        { offset: 10, mask: 0x02, names: ALL_BUTTONS.BR }, // BT right
        { offset: 10, mask: 0x08, names: ALL_BUTTONS.BT }, // BT top

        { offset: 10, mask: 0x40, names: ALL_BUTTONS.BML }, // minus
        { offset: 10, mask: 0x80, names: ALL_BUTTONS.BMR }, // plus
        
        { offset: 10, mask: 0x10, names: ALL_BUTTONS.L1 },
        { offset: 10, mask: 0x20, names: ALL_BUTTONS.R1 },

        { offset: 11, mask: 0x01, names: ALL_BUTTONS.LStickBt }, // ZL
        { offset: 11, mask: 0x02, names: ALL_BUTTONS.RStickBt }, // ZR

        // { offset: 8, mask: 0x04, names: ALL_BUTTONS.L2 },
        // { offset: 8, mask: 0x08, names: ALL_BUTTONS.R2 },
    ],
    dpadOffset: 11,
    dpadBitShift: 2,
    dpad: {
        0b0000: [0x80, 0x80], // neutral
        0b0001: [0x80, 0xFF], //       up
        0b0010: [0xFF, 0xFF], // right up
        0b0011: [0xFF, 0x80], // right
        0b0100: [0xFF, 0x00], // right down
        0b0101: [0x80, 0x00], //       down
        0b0110: [0x00, 0x00], // left  down 
        0b0111: [0x00, 0x80], // left
        0b1000: [0x00, 0xFF], // left  up
    }
}

const ctrl = new PlayStationController({vendorId: 1118, productId: 654, mapping: dualShockUSB});

let prev = '';
ctrl.on('raw', (data) => {
    // Hexa:    
    // let txt = data.subarray(0, 48).toString('hex').replace(/(..)/g, '$1 ');
    // txt = txt.replace(/([0-9a-f ]{11} )/g, '$1 ');

    let txt = (data[11] >> 2).toString(2).padStart(6, '0').substring(2)
    txt = '0b' + txt;

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
        console.log(out);
        prev = txt;
    }
});

// ctrl.on('share', (val) => console.log('share', val));
// ctrl.on('options', (val) => console.log('options', val));
// ctrl.on('LStickBt', (val) => console.log('share', val));
// ctrl.on('RStickBt', (val) => console.log('options', val));
// ctrl.on('L1', (val) => console.log('L1:', val));
// ctrl.on('R1', (val) => console.log('R1:', val));
//ctrl.on('L2', (val) => console.log('L2:', val));
//ctrl.on('R2', (val) => console.log('R2:', val));
//ctrl.on('dpad', (x,y) => console.log('dpad:', x, y));
//ctrl.on('circle', (val) => console.log('circle:', val));
//ctrl.on('square', (val) => console.log('square:', val));
//ctrl.on('triangle', (val) => console.log('triangle:', val));
//ctrl.on('cross', (val) => console.log('cross:', val));

// ctrl.on('raw', (data) => console.log(data.subarray(8, 12).toString('hex').replace(/(..)/g, '$1 ')));

ctrl.start();
