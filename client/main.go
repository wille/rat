package main

import (
	"crypto/tls"
	"encoding/binary"
	"fmt"
	"os/user"
)

func main() {
	service := "localhost:9999"

	conn, err := tls.Dial("tcp", service, &tls.Config{
		InsecureSkipVerify: true,
	})

	if err != nil {
		panic(err)
	}

	u, err := user.Current()

	if err != nil {
		fmt.Println(err.Error())
	}

	username := u.Name

	fmt.Println(u)

	err = binary.Write(conn, binary.LittleEndian, int16(5))
	binary.Write(conn, binary.LittleEndian, int32(len(username)))
	fmt.Fprint(conn, username)

}
