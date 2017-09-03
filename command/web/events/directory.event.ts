/// <reference path="../views/view.ts" />

interface FileEntry {
	path: string;
	directory: boolean;
	size: string;
	time: string;
}

interface DirectoryMessageParameters {
	files: FileEntry[];
}

class DirectoryEvent implements IncomingEvent<DirectoryMessageParameters> {

	constructor(private view: DirectoryView) { }

	public emit(d: DirectoryMessageParameters) {
		this.view.table.innerHTML = "";

		var data = d.files;

		for (let i = 0; i < data.length; i++) {
			let entry = data[i];

			let row = this.view.table.insertRow(i);

			let pathCell = row.insertCell(0);
			pathCell.innerHTML = entry.path;

			if (entry.directory) {
				pathCell.onclick = () => {
					this.view.browse(entry.path);
				};
			}

			pathCell.className = Icons.getFileIcon(entry.path, entry.directory);

			let sizeCell = row.insertCell(1);
			if (entry.size !== "0 B") {
				sizeCell.innerHTML = entry.size;
			}

			let modCell = row.insertCell(2);
			modCell.innerHTML = entry.time;

			row.onclick = () => {
				if (row.className === "") {
					row.className = "selected";
				} else {
					row.className = "";
				}
			};
		}
	}
}
