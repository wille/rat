#ifndef _SCREEN_H
#define _SCREEN_H

typedef struct {
	int x, y, width, height;
} MonitorCoordinates;

typedef struct {
	int id;
	MonitorCoordinates coordinates;
} Monitor;

// Called for each monitor detected when calling QueryMonitors()
// Defined in Go
extern void MonitorCallback(Monitor m);

// Queries all monitors
// Uses MonitorCallback() for callback
void QueryMonitors(void);

char *GetScreenshot(Monitor m, int *size);

#endif