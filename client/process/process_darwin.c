#include <sys/sysctl.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <errno.h>
#include <libproc.h>

#include "process.h"

typedef struct kinfo_proc kinfo_proc;

static int GetBSDProcessList (kinfo_proc **procList, size_t *procCount) {
    int err;
    kinfo_proc *result;
    bool done;
    static const int name[] = {CTL_KERN, KERN_PROC, KERN_PROC_ALL, 0};
    // Declaring name as const requires us to cast it when passing it to
    // sysctl because the prototype doesn't include the const modifier.
    size_t length;

    *procCount = 0;

    // We start by calling sysctl with result == NULL and length == 0.
    // That will succeed, and set length to the appropriate length.
    // We then allocate a buffer of that size and call sysctl again
    // with that buffer.  If that succeeds, we're done.  If that fails
    // with ENOMEM, we have to throw away our buffer and loop.  Note
    // that the loop causes use to call sysctl with NULL again; this
    // is necessary because the ENOMEM failure case sets length to
    // the amount of data returned, not the amount of data that
    // could have been returned.

    result = NULL;
    done = false;
    do {
        // Call sysctl with a NULL buffer.

        length = 0;
        err = sysctl ((int *) name, (sizeof(name) / sizeof(*name)) - 1,
                     NULL, &length,
                     NULL, 0);
        if (err == -1) {
            err = errno;
        }

        // Allocate an appropriately sized buffer based on the results
        // from the previous call.
        if (err == 0) {
            result = (kinfo_proc *)malloc (length);
            if (result == NULL) {
                err = ENOMEM;
            }
        }

        // Call sysctl again with the new buffer.  If we get an ENOMEM
        // error, toss away our buffer and start again.
        if (err == 0) {
            err = sysctl ((int *) name, (sizeof(name) / sizeof(*name)) - 1,
                         result, &length,
                         NULL, 0);
            if (err == -1) {
                err = errno;
            }
            if (err == 0) {
                done = true;
            } else if (err == 1) {
                free (result);
                result = NULL;
                err = 0;
            }
        }
    } while (err == 0 && ! done);

    // Clean up and establish post conditions.

    if (err != 0 && result != NULL) {
        free (result);
        result = NULL;
    }
    *procList = result;
    if (err == 0) {
        *procCount = length / sizeof(kinfo_proc);
    }

    return err;
}

void QueryProcesses(void) {
    struct kinfo_proc *procs;
    size_t count;
    int err = GetBSDProcessList(&procs, &count);
   
    for (size_t i = 0; i != count; ++i) {
		Process p;		

		int pid = procs[i].kp_proc.p_pid;
		
		p.pid = procs[i].kp_proc.p_pid;

		char path[PROC_PIDPATHINFO_MAXSIZE];
		proc_pidpath(procs[i].kp_proc.p_pid, path, sizeof(path));
		p.path = path;

		ProcessCallback(p);
    }

    free(procs);
}