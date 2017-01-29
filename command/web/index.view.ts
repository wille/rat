/// <reference path="view.ts" />

class IndexView extends View {

	private interval: number;

	constructor() {
		super("clients");
	}

	onEnter() {
		$("#subview_toolbar").hide();

		this.interval = update("#clients", "/clients #clients", 1000, () => {
			this.updatePing();
			this.updateOSIcons();
		});
	}

	onLeave() {
		clearInterval(this.interval);
		$("#subview_toolbar").show();
	}

	private updatePing() {
		$(".ping").each(function(index, element) {
			let ping = $(this).text();

			$(this).removeClass();
			$(this).addClass("ping");
			$(this).addClass(Icons.getPingClass(ping));

			$(this).text(ping);
		});
	}

	private updateOSIcons() {
		$(".os").each(function(index, element) {
			let os = $(this).text();
			os = os.trim();

			let icon = Icons.getOperatingSystemIcon(os);

			$(this).children().attr("src", icon);
		});
	}
}
