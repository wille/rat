/// <reference path="view.ts" />

class DirectoryEvent implements Control.IncomingEvent {

	constructor(private view: DirectoryView, private id: number) { }

	public emit(data) {
		data = JSON.parse(data);

		this.view.table.innerHTML = "";

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

			let downloadCell = row.insertCell(3);
			downloadCell.innerHTML = "Download";
			downloadCell.onclick = () => {
				let file = this.view.current + entry.path;

				let transfer = new Transfer(file);
				Transfers.addTransfer(transfer);

				let json = JSON.stringify({
					"file": file
				});
				Control.instance.write(Control.EventType.DOWNLOAD, json, this.id);
				
				setTransfersView();
			};
		}
	}
}
