type DownloadParameter = string;

class DownloadEvent implements IncomingEvent<DownloadParameter> {

	public emit(data: DownloadParameter) {
		document.location.href = "/download?key=" + data;
	}
}
