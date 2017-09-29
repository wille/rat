interface DownloadParameters {
    key: string;
}

class DownloadEvent implements IncomingEvent<DownloadParameters> {

	public emit(data: DownloadParameters) {
		document.location.href = "/download?key=" + data.key;
	}
}
