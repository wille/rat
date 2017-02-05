/// <reference path="view.ts" />

class DownloadEvent implements Control.IncomingEvent {

	public emit(data) {
		let form = document.createElement("form");
		form.setAttribute("action", "/download");

		let file = document.createElement("input");
		file.setAttribute("type", "hidden");
		file.setAttribute("name", "key");
		file.setAttribute("value", data);
		form.appendChild(file);

		form.submit();
	}
}
