namespace Transfers {

	export enum Status {
		COMPLETE,
		FAIL,
		IN_PROGRESS
	}

	let TRANSFERS: Transfer[] = [];

	export function addTransfer(transfer: Transfer) {
		TRANSFERS.push(transfer);
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
}

