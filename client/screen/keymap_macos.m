//+build darwin

#import <ApplicationServices/ApplicationServices.h>

// get macOS keycode from JavaScript key code
// references:
// https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// https://stackoverflow.com/questions/10734349/simulate-keypress-for-system-wide-hotkeys
CGKeyCode GetCode(unsigned char keycode) {
	switch (keycode) {
		case 65: return 0;
		case 83: return 1;
		case 68: return 2;
		case 70: return 3;
		case 72: return 4;
		case 71: return 5;
		case 90: return 6;
		case 88: return 7;
		case 67: return 8;
		case 86: return 9;
			// what is 10?
		case 66: return 11;
		case 81: return 12;
		case 87: return 13;
		case 69: return 14;
		case 82: return 15;
		case 89: return 16;
		case 84: return 17;
		case 49: return 18;
		case 50: return 19;
		case 51: return 20;
		case 52: return 21;
		case 53: return 22;
		case 54: return 23;
		case 187: return 24;
		case 57: return 25;
		case 55: return 26;
		case 109: return 27;
		case 56: return 28;
		case 48: return 29;
		case 221: return 30;
		case 79: return 31;
		case 85: return 32;
		case 219: return 33;
		case 73: return 34;
		case 80: return 35;
		case 13: return 36;
		case 76: return 37;
		case 74: return 38;
		case 222: return 39;
		case 75: return 40;
		case 186: return 41;
		case 220: return 42;
		case 188: return 43;
		case 191: return 44;
		case 78: return 45;
		case 77: return 46;
		case 190: return 47;
		case 9: return 48;
		case 32: return 49; // space
		case 192: return 50; // ` (grave accent)
		case 46: return 51; // delete key
		case 8: return 51; // backspace key
		//case 13: return 52; duplicate
		case 27: return 53;
		//case 190: return 65; another period
		case 106: return 67; // * (multiply)
		case 107: return 69;
		// case CLEAR: return 71;
		// case 220: return 75; duplicate
		// case ENTER: return 76;  // numpad enter
		// case 187: return 78; duplicate
		// case 187: return 81; another equal sign

		/*case 0: return 82;
		case 1: return 83;
		case 2: return 84;
		case 3: return 85;
		case 4: return 86;
		case 5: return 87;
		case 6: return 88;
		case 7: return 89;
		case 8: return 91;
		case 9: return 92;*/

		case 116: return 96;
		case 117: return 97;
		case 118: return 98;
		case 114: return 99;
		case 119: return 100;
		case 120: return 101;
		case 122: return 103;
		//case F13: return 105;
		//case F14: return 107;
		case 121: return 109;
		case 123: return 111;
		//case F15: return 113;
		//case HELP: return 114;
		case 36: return 115;
		case 33: return 116;
		//case 46: return 117; duplicate
		case 115: return 118;
		case 35: return 119;
		case 113: return 120;
		case 34: return 121;
		case 112: return 122;
		case 37: return 123;
		case 39: return 124;
		case 40: return 125;
		case 38: return 126;
		default: return 0;
	}
}