#include <windows.h>
#include <stdbool.h>

// Check if the registry key exists
bool CheckRegistry(char *name);

// Remove the registry key
void Cleanup(char *name);