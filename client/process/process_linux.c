#include "process.h"

#include <signal.h>

bool Kill(int pid) {
	return kill(pid, SIGTERM);
}