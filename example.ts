import {PlayStationController} from './src/index';
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
