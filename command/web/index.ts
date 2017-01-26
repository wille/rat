/// <reference path="view.ts" />

class IndexView extends View {

	private interval: number;

	constructor() {
		super("clients");
	}

	onEnter() {
		this.interval = update("#clients", "/clients #clients", 1000, function() {
			updatePing();
		});
	}

	onLeave() {
		clearInterval(this.interval);
	}
}