namespace Connection {
	export function setConnectionStatus(connected: boolean) {
		let element = document.getElementById("status");

		if (connected) {
			element.innerHTML = "Connected";
			element.className = "";
		} else {
			element.innerHTML = "Lost connection";
			element.className = "error";
		}
	}
}
