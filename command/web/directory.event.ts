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

			let actionsCell = row.insertCell(3);

			let downloadElement = document.createElement("p");
			downloadElement.innerHTML = "Download";
			downloadElement.onclick = () => {
				let file = this.view.current + entry.path;

				let transfer = new Transfer(true, file);
				Transfers.addTransfer(transfer);

				let json = JSON.stringify({
					"file": file
				});
				Control.instance.write(Control.EventType.DOWNLOAD, json, this.id);
				
				setTransfersView();
			};
			actionsCell.appendChild(downloadElement);

			let deleteElement = document.createElement("p");
			deleteElement.innerHTML = "Delete";
			deleteElement.onclick = () => {
				let file = this.view.current + entry.path;

				if (confirm("Are you sure that you want to delete \"" + file + "\"?")) {
					this.view.fileEvent(FileTask.UNLINK, file);
					this.view.reload();
				}
			};
			actionsCell.appendChild(deleteElement);
		}
	}
}
