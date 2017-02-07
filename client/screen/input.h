#ifndef _INPUT_H
#define _INPUT_H

#include "screen.h"

void MoveCursor(int m, int x, int y);
void Mouse(int m, int button, int type);
void Key(unsigned short key, int type);

enum Constant {
	LEFT = 0,
	RIGHT = 1,

	PRESS = 0,
	RELEASE = 1
};

typedef struct {
	int x, y;
} Point;

typedef struct {
	int button, type;
} ClickEvent;

#endif