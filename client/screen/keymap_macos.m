//+build darwin

#import <ApplicationServices/ApplicationServices.h>
#import <Carbon/Carbon.h>

enum {
	BACKSPACE = 8,
	TAB = 9,
	ENTER = 13,
	SHIFT = 16,
	CTRL = 17,
	ALT = 18,
	PAUSE = 19,
	CAPS_LOCK = 20,
	ESCAPE = 27,
	SPACE = 32,
	PAGE_UP = 33,
	PAGE_DOWN = 34,
	END = 35,
	HOME = 36,
	LEFT_ARROW = 37,
	UP_ARROW = 38,
	RIGHT_ARROW = 39,
	DOWN_ARROW = 40,
	INSERT = 45,
	DELETE = 46,
	KEY_0 = 48,
	KEY_1 = 49,
	KEY_2 = 50,
	KEY_3 = 51,
	KEY_4 = 52,
	KEY_5 = 53,
	KEY_6 = 54,
	KEY_7 = 55,
	KEY_8 = 56,
	KEY_9 = 57,
	KEY_A = 65,
	KEY_B = 66,
	KEY_C = 67,
	KEY_D = 68,
	KEY_E = 69,
	KEY_F = 70,
	KEY_G = 71,
	KEY_H = 72,
	KEY_I = 73,
	KEY_J = 74,
	KEY_K = 75,
	KEY_L = 76,
	KEY_M = 77,
	KEY_N = 78,
	KEY_O = 79,
	KEY_P = 80,
	KEY_Q = 81,
	KEY_R = 82,
	KEY_S = 83,
	KEY_T = 84,
	KEY_U = 85,
	KEY_V = 86,
	KEY_W = 87,
	KEY_X = 88,
	KEY_Y = 89,
	KEY_Z = 90,
	LEFT_META = 91,
	RIGHT_META = 92,
	SELECT = 93,
	NUMPAD_0 = 96,
	NUMPAD_1 = 97,
	NUMPAD_2 = 98,
	NUMPAD_3 = 99,
	NUMPAD_4 = 100,
	NUMPAD_5 = 101,
	NUMPAD_6 = 102,
	NUMPAD_7 = 103,
	NUMPAD_8 = 104,
	NUMPAD_9 = 105,
	MULTIPLY = 106,
	ADD = 107,
	SUBTRACT = 109,
	DECIMAL = 110,
	DIVIDE = 111,
	F1 = 112,
	F2 = 113,
	F3 = 114,
	F4 = 115,
	F5 = 116,
	F6 = 117,
	F7 = 118,
	F8 = 119,
	F9 = 120,
	F10 = 121,
	F11 = 122,
	F12 = 123,
	NUM_LOCK = 144,
	SCROLL_LOCK = 145,
	SEMICOLON = 186,
	EQUALS = 187,
	COMMA = 188,
	DASH = 189,
	PERIOD = 190,
	FORWARD_SLASH = 191,
	GRAVE_ACCENT = 192,
	OPEN_BRACKET = 219,
	BACK_SLASH = 220,
	CLOSE_BRACKET = 221,
	SINGLE_QUOTE = 222
};

// get macOS keycode from JavaScript key code
// references:
// https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// https://stackoverflow.com/questions/10734349/simulate-keypress-for-system-wide-hotkeys
//
// https://web.archive.org/web/20100501161453/http://www.classicteck.com/rbarticles/mackeyboard.php
// https://stackoverflow.com/questions/3202629/where-can-i-find-a-list-of-mac-virtual-key-codes
CGKeyCode GetCode(unsigned char keycode) {
	switch (keycode) {
		case KEY_A: return kVK_ANSI_A;
		case KEY_S: return kVK_ANSI_S;
		case KEY_D: return kVK_ANSI_D;
		case KEY_F: return kVK_ANSI_F;
		case KEY_H: return kVK_ANSI_H;
		case KEY_G: return kVK_ANSI_G;
		case KEY_Z: return kVK_ANSI_Z;
		case KEY_X: return kVK_ANSI_X;
		case KEY_C: return kVK_ANSI_C;
		case KEY_V: return kVK_ANSI_V;
		case KEY_B: return kVK_ANSI_B;
		case KEY_Q: return kVK_ANSI_Q;
		case KEY_W: return kVK_ANSI_W;
		case KEY_E: return kVK_ANSI_E;
		case KEY_R: return kVK_ANSI_R;
		case KEY_Y: return kVK_ANSI_Y;
		case KEY_T: return kVK_ANSI_T;
		case KEY_1: return kVK_ANSI_1;
		case KEY_2: return kVK_ANSI_2;
		case KEY_3: return kVK_ANSI_3;
		case KEY_4: return kVK_ANSI_4;
		case KEY_5: return kVK_ANSI_5;
		case KEY_6: return kVK_ANSI_6;
		case KEY_7: return kVK_ANSI_7;
		case KEY_8: return kVK_ANSI_8;
		case KEY_9: return kVK_ANSI_9;
		case KEY_0: return kVK_ANSI_0;
		case EQUALS: return kVK_ANSI_Equal;
		case DASH: return kVK_ANSI_Minus;
		case CLOSE_BRACKET: return kVK_ANSI_RightBracket;
		case KEY_O: return kVK_ANSI_O;
		case KEY_U: return kVK_ANSI_U;
		case OPEN_BRACKET: return kVK_ANSI_LeftBracket;
		case KEY_I: return kVK_ANSI_I;
		case KEY_P: return kVK_ANSI_P;
		case KEY_L: return kVK_ANSI_L;
		case KEY_J: return kVK_ANSI_J;
		case SINGLE_QUOTE: return kVK_ANSI_Quote;
		case KEY_K: return kVK_ANSI_K;
		case SEMICOLON: return kVK_ANSI_Semicolon;
		case BACK_SLASH: return kVK_ANSI_Backslash;
		case COMMA: return kVK_ANSI_Comma;
		case FORWARD_SLASH: return kVK_ANSI_Slash;
		case KEY_N: return kVK_ANSI_N;
		case KEY_M: return kVK_ANSI_M;
		case PERIOD: return kVK_ANSI_Period;
		case GRAVE_ACCENT: return kVK_ANSI_Grave;
		case DECIMAL: return kVK_ANSI_KeypadDecimal;
		case MULTIPLY: return kVK_ANSI_KeypadMultiply;
		case ADD: return kVK_ANSI_KeypadPlus;
		case DIVIDE: return kVK_ANSI_KeypadDivide;
		case SUBTRACT: return kVK_ANSI_KeypadMinus;
		case NUMPAD_0: return kVK_ANSI_Keypad0;
		case NUMPAD_1 : return kVK_ANSI_Keypad1;
		case NUMPAD_2: return kVK_ANSI_Keypad2;
		case NUMPAD_3: return kVK_ANSI_Keypad3;
		case NUMPAD_4: return kVK_ANSI_Keypad4;
		case NUMPAD_5: return kVK_ANSI_Keypad5;
		case NUMPAD_6: return kVK_ANSI_Keypad6;
		case NUMPAD_7: return kVK_ANSI_Keypad7;
		case NUMPAD_8: return kVK_ANSI_Keypad8;
		case NUMPAD_9: return kVK_ANSI_Keypad9;

		// keycodes for keys that are independent of keyboard layout
		case ENTER: return kVK_Return;
		case TAB: return kVK_Tab;
		case SPACE: return kVK_Space;
		case BACKSPACE: return kVK_Delete;
		case ESCAPE: return kVK_Escape;
		case SHIFT: return kVK_Shift;
		case CAPS_LOCK: return kVK_CapsLock;
		case DELETE: return kVK_ForwardDelete;

		// mac keys
		//case : return kVK_Command;
		//case : return kVK_Option;
		//case : return kVK_Control;
		//case : return kVK_RightShift;
		//case : return kVK_RightOption;
		//case : return kVK_RightControl;
		//case : return kVK_Function;
		//case : return kVK_F13;
		//case : return kVK_F14;
		//case : return kVK_F15	;
		//case : return kVK_F16;
		//case : return kVK_F17;
		//case : return kVK_VolumeUp;
		//case : return kVK_VolumeDown;
		//case : return kVK_Mute;
		//case : return kVK_F18;
		//case : return kVK_F19;
		//case : return kVK_F20;
		//case : return kVK_Help;

		// Unknown key codes
		//case : return kVK_ANSI_KeypadEnter;
		//case : return kVK_ANSI_KeypadEquals;
		//case : return kVK_ANSI_KeypadClear;

		case F5: return kVK_F5;
		case F6: return kVK_F6;
		case F7: return kVK_F7;
		case F3: return kVK_F3;
		case F8: return kVK_F8;
		case F9: return kVK_F9;
		case F11: return kVK_F11;
		case F10: return kVK_F10;
		case F12: return kVK_F12;
		case HOME: return kVK_Home;
		case PAGE_UP: return kVK_PageUp;
		case F4: return kVK_F4;
		case END: return kVK_End;
		case F2: return kVK_F2;
		case PAGE_DOWN: return kVK_PageDown;
		case F1: return kVK_F1;
		case LEFT_ARROW: return kVK_LeftArrow;
		case RIGHT_ARROW: return kVK_RightArrow;
		case DOWN_ARROW: return kVK_DownArrow;
		case UP_ARROW: return kVK_UpArrow;
		default: return 0;
	}
}