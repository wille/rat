//+build prod

package main

import (
	"encoding/binary"
	"encoding/json"
	"os"
	"rat/shared"
	"rat/shared/crypto"
)

var Config shared.BinaryConfig

func ParseConfig() error {
	this := os.Args[0]

	f, err := os.Open(this)
	if err != nil {
		return err
	}

	stat, err := f.Stat()
	if err != nil {
		return err
	}

	// Read offset from end of file (32 bits)
	f.Seek(stat.Size()-4, 0)
	var offset int32
	binary.Read(f, shared.ByteOrder, &offset)

	// Read config from offset
	f.Seek(int64(offset), 0)
	b := make([]byte, stat.Size()-int64(offset)-4-crypto.KeyLength-crypto.IvLength)
	f.Read(b)

	f.Seek(stat.Size()-4-crypto.KeyLength-crypto.IvLength, 0)
	key := make([]byte, crypto.KeyLength)
	f.Read(key)

	f.Seek(stat.Size()-4-crypto.IvLength, 0)
	iv := make([]byte, crypto.IvLength)
	f.Read(iv)

	b = crypto.Decrypt(b, key, iv)

	err = json.Unmarshal(b, &Config)

	return err
}
