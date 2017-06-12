/// <reference path="../views/view.ts" />

type ProcessParameter = string

class ProcessEvent implements IncomingEvent<ProcessParameter> {

	constructor(private table: HTMLTableElement) { }

	public emit(data: ProcessParameter) {
		let split = data.split(",");
		let pid = split[0];
		let path = split[1];

		let row = this.table.insertRow(0);

		let pidCell = row.insertCell(0);
		pidCell.innerHTML = pid;

		let pathCell = row.insertCell(1);
		pathCell.innerHTML = path;

		row.onclick = () => {
			if (row.className === "") {
				row.className = "selected";
			} else {
				row.className = "";
			}
		}
	}
}
