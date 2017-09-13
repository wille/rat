class MonitorEvent implements IncomingEvent<Monitor[]> {

	constructor(private parent: ScreenView) {

	}

	public emit(data: Monitor[]) {
		let selected = this.parent.selectedMonitor;

		let element = this.parent.monitorsElement;

		// Remove all menu items from dropdown
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}

		this.parent.monitorCount = data.length;

		for (let i = 0; i < data.length; i++) {
			let monitor = data[i];

			// If no monitor is selected (on open) set the first one
			if (this.parent.selectedMonitor === undefined) {
				this.parent.selectedMonitor = monitor.id;
				selected = monitor.id;
			}

			let str = monitor.id + ": " + monitor.width + "x" + monitor.height;

			let child = document.createElement("li");
			let a = document.createElement("a");
			child.appendChild(a);

			a.innerText = str;
			child.onclick = () => {
				this.parent.selectedMonitor = monitor.id;
				this.parent.initStream();
			};

			// If this monitor is selected, disable the menu item
			if (selected === i) {
				child.className = "disabled";
			}

			element.appendChild(child);
		}
	}
}
