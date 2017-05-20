class MonitorEvent implements Control.IncomingEvent {

	constructor(private element: HTMLSelectElement) {

	}

	public emit(data) {
		data = JSON.parse(data);

		let selected = this.element.selectedIndex;

		while (this.element.firstChild) {
			this.element.removeChild(this.element.firstChild);
		}

		for (let i = 0; i < data.length; i++) {
			let monitor = data[i];
			let str = monitor.id + ": " + monitor.w + "x" + monitor.h;

			let child = <HTMLOptionElement>document.createElement("option");
			child.innerHTML = str;
			child.value = monitor.id;

			if (selected === i) {
				child.selected = true;
			}

			this.element.appendChild(child);
		}
	}
}
