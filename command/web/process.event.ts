/// <reference path="view.ts" />

class ProcessEvent implements Control.IncomingEvent {

	constructor(private table: HTMLTableElement, private id: number) { }

	public emit(data) {
		data = data.split(",");
		let pid = data[0];
		let path = data[1];

		let row = this.table.insertRow(1);

		let pidCell = row.insertCell(0);
		pidCell.innerHTML = pid;

		let pathCell = row.insertCell(1);
		pathCell.innerHTML = path;
	}
}
