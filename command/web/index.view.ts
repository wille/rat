/// <reference path="view.ts" />

class IndexView extends MainView {

	private interval: number;

	constructor() {
		super("clients", "Clients");
	}

	onEnter() {
		this.interval = update("#clients", "/clients #clients", 1000, () => {
			Icons.updatePing();
			Icons.updateOSIcons();
		});
	}

	onLeave() {
		clearInterval(this.interval);
	}
}
