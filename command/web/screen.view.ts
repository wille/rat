/// <reference path="view.ts" />

class ScreenView extends View {

	constructor(id: number) {
		super("static/screen.html", "Screen", id);
	}

	onEnter() {
		let scaleElement = <HTMLInputElement>document.getElementById("scale");
		scaleElement.addEventListener("change", () => {
			// Set text to scale in percentage
			let currentScaleElement = <HTMLParagraphElement>document.getElementById("current_scale");
			currentScaleElement.innerHTML = scaleElement.value + "%";

			this.initStream();
		});

		this.initStream();

		let screenElement = <HTMLImageElement>document.getElementById("screen");
		Control.addEvent(Control.EventType.SCREEN, new ScreenEvent(screenElement, this.id));

		let monitorsElement = <HTMLSelectElement>document.getElementById("monitors");
		monitorsElement.addEventListener("change", () => this.initStream());
		Control.addEvent(Control.EventType.MONITOR, new MonitorEvent(monitorsElement));
	}

	onLeave() {
		Control.removeEvent(Control.EventType.SCREEN);
		Control.removeEvent(Control.EventType.MONITOR);

		let data = JSON.stringify({
			"Activate": false
		});
		Control.instance.write(Control.EventType.SCREEN, data, this.id);
	}

	// Sends screen event with new configuration
	private initStream() {
		let scaleElement = <HTMLInputElement>document.getElementById("scale");
		let scale  = scaleElement.value;

		let monitorsElement = <HTMLSelectElement>document.getElementById("monitors");
		let selected = monitorsElement.options[monitorsElement.selectedIndex];
		let monitor = !selected ? 0 : Number(selected.value);

		let data = JSON.stringify({
			"Activate": true,
			"Scale": Number(scale) / 100,
			"Monitor": monitor
		});

		Control.instance.write(Control.EventType.SCREEN, data, this.id);
	}
}
