package windows

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image/png"
	"os"
	"strconv"
	"testing"
)

func TestQuery(t *testing.T) {
	QueryWindows()

	count := len(Windows)

	if count == 0 {
		t.Error("no windows found")
	}

	foundTitle := false
	for _, w := range Windows {
		if w.Title != "" {
			foundTitle = true

			if w.HasIcon() {
				file, _ := os.Create("icon" + strconv.Itoa(w.Handle) + ".png")
				defer file.Close()

				decoded, err := base64.StdEncoding.DecodeString(w.Icon)
				if err != nil {
					t.Error("failed decoding window icon base64: ", err)
					continue
				}

				b := bytes.NewBuffer(decoded)
				icon, err := png.Decode(b)
				if err != nil {
					t.Error("failed decoding window icon png: ", err)
					continue
				}

				png.Encode(file, icon)
			}

			w.Icon = ""
			fmt.Println(w)
		}
	}

	if !foundTitle {
		t.Error("no window was found with a title")
	}
}
