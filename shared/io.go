package shared

type Writer interface {
	WriteInt(int) error
	WriteString(string) error
}

type Reader interface {
	// Can't pass built in types here
	//ReadVar(i *interface{}) error
	ReadInt() (int, error)
	ReadString() (string, error)
}
