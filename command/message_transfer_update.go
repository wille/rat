package main

type TransferUpdateMessage Transfer

func (TransferUpdateMessage) Header() MessageHeader {
	return TransferUpdateEvent
}
