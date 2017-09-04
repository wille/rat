package computer

import "testing"

func TestComputer(t *testing.T) {
	c := GetComputerInformation()

	if c.Username == "" {
		t.Error("Username not found")
	}

	if c.Hostname == "" {
		t.Error("Hostname not found")
	}

	if c.HomeDir == "" {
		t.Error("HomeDir not found")
	}
}
