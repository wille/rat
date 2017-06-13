/// <reference path="view.ts" />

const enum TableCell {
    COUNTRY,
    HOST,
    COMPUTER,
    OS,
    PING
}

/**
 * Cells that allows changes
 */
type DynamicCell = TableCell.PING;

class IndexView extends MainView {

	private tableBody: HTMLTableSectionElement;

	rows: HTMLTableRowElement[] = [];

	constructor() {
		super("static/clients.html", "Clients");
	}

	onEnter() {
		this.tableBody = <HTMLTableSectionElement>super.getElementById("body");
	}

	onLeave() {

	}

	/**
	 * Returns specific cell element for a client
	 * @param client 
	 * @param cell 
	 */
	private getCellElement(client: Client, cell: TableCell): HTMLElement {
		let row = this.rows[client.id];

		if (row) {
			return row.cells.item(cell);
		}

		return undefined;
    }

	/**
	 * Update table cell value
	 * @param client 
	 * @param cell Which cell to update
	 * @param value Value to change to
	 */
	public setCell(client: Client, cell: DynamicCell, value: any) {
		switch (cell) {
			case TableCell.PING:
				let element = this.getCellElement(client, cell);
				element.innerText = value;
				element.className = "ping " + Icons.getPingClass(client.ping);
				break;
			default:
				console.error("cannot update readonly value", cell);
				break;
		}
	}

	/**
	 * Add client to table, create row and cells, add default readonly values
	 * @param client 
	 */
	public add(client: Client) {
		let row = this.tableBody.insertRow();
		this.rows[client.id] = row;

		let countryCell = row.insertCell(TableCell.COUNTRY);

		let flagElement = document.createElement("img");
		flagElement.src = "static/images/flags/" + client.flag + ".png";
		countryCell.appendChild(flagElement);

		let countryTextElement = document.createElement("span");
		countryTextElement.innerText = client.country;
		countryCell.appendChild(countryTextElement);

		let hostCell = row.insertCell(TableCell.HOST);
		hostCell.innerHTML = client.host;

		let computerCell = row.insertCell(TableCell.COMPUTER);
		computerCell.innerHTML = client.computerName;

		let osCell = row.insertCell(TableCell.OS);
		
		let osIconElement = document.createElement("img");
		osIconElement.src = Icons.getOperatingSystemIcon(client.operatingSystem);
		osCell.appendChild(osIconElement);

		let osTextElement = document.createElement("span");
		osTextElement.innerText = client.operatingSystem;
		osCell.appendChild(osTextElement);

		let pingCell = row.insertCell(TableCell.PING);
		this.setCell(client, TableCell.PING, client.ping);
	}

	/**
	 * Remove client from table
	 * @param client
	 */
	public remove(client: Client) {
		this.tableBody.removeChild(this.rows[client.id]);
		delete this.rows[client.id];
	}
}

function setProcessesView(id: number) {
	sub.setView(new ProcessView(new Client(id)));
}

function setDirectoryView(id: number, separator: string) {
	sub.setView(new DirectoryView(new Client(id), separator));
}

function setScreenView(id: number) {
	sub.setView(new ScreenView(new Client(id)));
}