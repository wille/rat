package main

type DownloadQueryMessage struct {
	Key string `json:"key"`
}

func (m DownloadQueryMessage) Header() MessageHeader {
	return DownloadQueryHeader
}
