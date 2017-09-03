type DownloadParameter = string;

class DownloadEvent implements IncomingMessage<DownloadParameter> {

	public emit(data: DownloadParameter) {
		document.location.href = "/download?key=" + data;
	}
}
