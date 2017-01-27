namespace Connection {
	export function setConnectionStatus(connected: boolean) {
		let element = $("#error");

		switch (connected) {
			case true:
				element.hide();
				break;
			case false:
				element.show();
				element.text("Lost connection");
				break;
		}
	}
}