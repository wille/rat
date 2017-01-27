#ifndef _PROCESS_H
#define _PROCESS_H

#ifndef MAX_PATH
#define MAX_PATH 256
#endif

typedef struct {
	char *path;
	int pid;
} Process;

extern void ProcessCallback(Process p);

void QueryProcesses(void);

#endif