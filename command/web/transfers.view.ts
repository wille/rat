/// <reference path="view.ts" />

class TransfersView extends View {

	private element: HTMLTableElement;
	private interval: number;

	constructor() {
		super("static/transfers.html", "Transfers");
	}

	onEnter() {
		this.element = <HTMLTableElement>document.getElementById("transfers");

		this.update();

		this.interval = setInterval(() => {
			this.update();
		}, 1000);
	}

	onLeave() {
		clearInterval(this.interval);
	}

	private update() {
		this.element.innerHTML = "";

		for (let t of Transfers.getTransfers()) {
			this.addTransfer(t);
		}
	}

	private addTransfer(transfer: Transfer) {
		let row = this.element.insertRow(0);

		let statusCell = row.insertCell(0);
		let str;

		switch (transfer.status) {
			case Transfers.Status.COMPLETE: 
				str = "Complete";
				break;
			case Transfers.Status.IN_PROGRESS:
				str = "Transferring...";
				break;
			case Transfers.Status.FAIL:
				str = "Error";
				break;
			default:
				str = transfer.status;
				break;
		}
		statusCell.innerHTML = str;

		let localCell = row.insertCell(1);
		localCell.innerHTML = transfer.local !== undefined ? transfer.local : "";

		let remoteCell = row.insertCell(2);
		remoteCell.innerHTML = transfer.remote !== undefined ? transfer.remote : "";

		let progressCell = row.insertCell(3);
		progressCell.innerHTML = '<progress value=' + transfer.progress + ' min=0 max=100></progress>';
	}
}
