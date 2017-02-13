/// <reference path="view.ts" />

class IndexView extends View {

	private interval: number;

	constructor() {
		super("clients", "Clients");
	}

	onEnter() {
		$("#subview_toolbar").hide();

		this.interval = update("#clients", "/clients #clients", 1000, () => {
			Icons.updatePing();
			Icons.updateOSIcons();
		});
	}

	onLeave() {
		clearInterval(this.interval);
		$("#subview_toolbar").show();
	}
}
