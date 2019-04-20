package shared

type FileTask int

const (
	// Touch or create file
	Touch FileTask = 0

	// Unlink file
	Unlink FileTask = 1

	// Move file
	Move FileTask = 2

	// Copy file
	Copy FileTask = 3
)
