/// <reference path="view.ts" />

class ScreenView extends View {

	private fps: HTMLElement;
	private screenElement;
	private screenEvent: ScreenEvent;

	constructor(id: number) {
		super("static/screen.html", "Screen", id);

		this.fps = document.createElement("p");
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

		let monitorsElement = <HTMLSelectElement>document.getElementById("monitors");
		monitorsElement.addEventListener("change", () => this.initStream());
		Control.addEvent(Control.EventType.MONITOR, new MonitorEvent(monitorsElement));

		this.screenElement = <HTMLImageElement>document.getElementById("screen");
		this.screenEvent = new ScreenEvent(this.screenElement, this.id, (fps) => {
			this.fps.innerHTML = fps + " FPS";
		});

		Control.addEvent(Control.EventType.SCREEN, this.screenEvent);

		Statusbar.addElement(this.fps);
	}

	onLeave() {
		Control.removeEvent(Control.EventType.SCREEN);
		Control.removeEvent(Control.EventType.MONITOR);

		Statusbar.removeElement(this.fps);

		let data = JSON.stringify({
			"Activate": false
		});
		Control.instance.write(Control.EventType.SCREEN, data, this.id);

		this.screenEvent.stop();
	}

	// Sends screen event with new configuration
	private initStream() {
		let scaleElement = <HTMLInputElement>document.getElementById("scale");
		let scale  = scaleElement.value;

		let monitorsElement = <HTMLSelectElement>document.getElementById("monitors");
		let selected = monitorsElement.options[monitorsElement.selectedIndex];
		let monitor = !selected ? 0 : Number(selected.value);

		let data = JSON.stringify({
			"active": true,
			"scale": Number(scale) / 100,
			"monitor": monitor
		});

		Control.instance.write(Control.EventType.SCREEN, data, this.id);
	}
}
