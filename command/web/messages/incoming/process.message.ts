/// <reference path="../../views/view.ts" />

interface ProcessParameters {
	pid: number;
	path: string;
}

class ProcessEvent implements IncomingMessage<ProcessParameters> {

	constructor(private table: HTMLTableElement) { }

	public emit(data: ProcessParameters) {
		let row = this.table.insertRow(0);

		let pidCell = row.insertCell(0);
		pidCell.innerHTML = String(data.pid);

		let pathCell = row.insertCell(1);
		pathCell.innerHTML = data.path;

		row.onclick = () => {
			if (row.className === "") {
				row.className = "selected";
			} else {
				row.className = "";
			}
		}
	}
}
