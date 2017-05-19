/// <reference path="view.ts" />
/// <reference path="build.view.ts" />

class DownloadEvent implements Control.IncomingEvent {

	public emit(data) {
		document.location.href = "/download?key=" + data;
	}
}
