/// <reference path="view.ts" />

class IndexView extends MainView {

	private interval: number;

	constructor() {
		super("clients", "Clients");
	}

	onEnter() {
		this.interval = update("#clients", "/clients #clients", 1000, this.onUpdate);
	}

	onLeave() {
		clearInterval(this.interval);
	}

	private onUpdate() {
		Icons.updatePing();
		Icons.updateOSIcons();
	}
}
