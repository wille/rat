/// <reference path="view.ts" />

class IndexView extends View {

	private interval: number;

	constructor() {
		super("index");
	}

	onEnter() {
		this.interval = update("#clients", "/index #clients", 1000, function() {
			updatePing();
		});
	}

	onLeave() {
		clearInterval(this.interval);
	}
}