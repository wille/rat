namespace Transfers {

	export enum Status {
		COMPLETE,
		FAIL,
		IN_PROGRESS
	}

	export let TRANSFERS: Transfer[] = [];

	export function addTransfer(transfer: Transfer, update: boolean = true) {
		TRANSFERS.push(transfer);
		
		if (update) {
			this.update();
		}
	}

	export function update() {
		Control.instance.send(new TransfersMessage({
            transfers: TRANSFERS
        }));
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
	public key: string;

	constructor(public download: boolean, public remote: string, public local?: string) {
		this.id = Math.random();
		this.status = Transfers.Status.IN_PROGRESS;
	}

	public setStatus(status: Transfers.Status, update: boolean = true) {
		this.status = status;

		if (update) {
			Transfers.update();
		}
	}

	public complete() {
		this.progress = 100;
		this.status = Transfers.Status.COMPLETE;
		Transfers.update();
	}

	public static create(json: any): Transfer {
		let t = new Transfer(json.remove, json.local);
		t.id = json.id;
		t.status = json.status;
		t.progress = json.progress;
		t.remote = json.remote;
		t.local = json.local;
		t.key = json.key;

		return t;
	}
}

