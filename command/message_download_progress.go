package main

type DownloadProgressEvent struct {
	File  string `json:"file"`
	Read  int64  `json:"read"`
	Total int64  `json:"total"`
	Key   string `json:"key,omitempty"`
}

func (m DownloadProgressEvent) Header() MessageHeader {
	return DownloadProgressUpdateEvent
}
