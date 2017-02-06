namespace Transfers {

	export enum Status {
		COMPLETE,
		FAIL,
		IN_PROGRESS
	}

	let TRANSFERS: Transfer[] = [];

	export function addTransfer(transfer: Transfer, update: boolean = true) {
		TRANSFERS.push(transfer);

		let data = JSON.stringify(TRANSFERS);
		
		if (update) {
			Control.instance.write(Control.EventType.TRANSFERS, data, -1);
		}
	}

	export function getTransfers(): Transfer[] {
		return TRANSFERS;
	}

	export function getTransfer(id: number) {
		for (let t of TRANSFERS) {
			if (t.id === id) {
				return t;
			}
		}

		return null;
	}
}

class Transfer {

	public id: number;
	public progress: number;
	public status: Transfers.Status;

	constructor(public remote: string, public local?: string) {
		this.id = Math.random();
		this.status = Transfers.Status.IN_PROGRESS;
	}

	public complete() {
		this.progress = 100;
		this.status = Transfers.Status.COMPLETE;
	}

	public toString() {
		return JSON.stringify({
			"id": this.id,
			"progress": this.progress,
			"status": this.status,
			"remote": this.remote,
			"local": this.local
		});
	}

	public static create(json: any): Transfer {
		let t = new Transfer(json.remove, json.local);
		t.id = json.id;
		t.status = json.status;
		t.progress = json.progress;
		t.remote = json.remote;
		t.local = json.local;

		return t;
	}
}

