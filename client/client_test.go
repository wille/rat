package main

import (
	"strconv"
	"testing"
	"time"
)

func TestMany(t *testing.T) {
	err := ParseConfig()
	if err != nil {
		t.Error(err)
	}

	for i := 0; i < 25; i++ {
		Config.Name = "test" + strconv.Itoa(i)
		go start(Config)
	}

	time.Sleep(time.Second * 60)
}
