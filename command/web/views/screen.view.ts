class ScreenView extends SubView {

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
		this.screenElement.onmousemove = (event) => {
			if (this.moveMouse) {
				let data = JSON.stringify({
					"id": this.monitor,
					"x": event.offsetX / (this.scale / 100),
					"y": event.offsetY / (this.scale / 100)
				});
				Control.instance.write(Control.EventType.MOUSE_MOVE, data, this.id);
			}
		};

		this.screenElement.onmousedown = (event) => this.mouseEvent(event.button, Mouse.PRESS);
		this.screenElement.onmouseup = (event) => this.mouseEvent(event.button, Mouse.RELEASE);

		document.onkeydown = (event) => this.keyEvent(event.keyCode, Mouse.PRESS);
		document.onkeyup = (event) => this.keyEvent(event.keyCode, Mouse.RELEASE);

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
			"active": false
		});
		Control.instance.write(Control.EventType.SCREEN, data, this.id);

		this.screenEvent.stop();

		document.onkeydown = undefined;
		document.onkeyup = undefined;
	}

	private get monitor(): number {
		let monitorsElement = <HTMLSelectElement>document.getElementById("monitors");
		let selected = monitorsElement.options[monitorsElement.selectedIndex];
		let monitor = !selected ? 0 : Number(selected.value);

		return monitor;
	}

	private get scale(): number {
		let scaleElement = <HTMLInputElement>document.getElementById("scale");
		let scale = scaleElement.value;

		return Number(scale);
	}

	private get moveMouse() {
		let element = <HTMLInputElement>document.getElementById("cursor");

		return element.checked;
	}

	private get keyboard() {
		let element = <HTMLInputElement>document.getElementById("keyboard");

		return element.checked;
	}

	private mouseEvent(button: Mouse, event: Mouse) {
		if (this.moveMouse) {
			let data = JSON.stringify({
				"id": this.monitor,
				"button": button,
				"event": event
			});

			Control.instance.write(Control.EventType.MOUSE, data, this.id);
		}
	}

	private keyEvent(keyCode: number, event: Mouse) {
		if (this.keyboard && keyCode !== 255) {
			let data = JSON.stringify({
				"key": keyCode,
				"event": event
			});

			Control.instance.write(Control.EventType.KEY, data, this.id);
		}
	}

	// Sends screen event with new configuration
	private initStream() {
		let data = JSON.stringify({
			"active": true,
			"scale": this.scale / 100,
			"monitor": this.monitor
		});

		Control.instance.write(Control.EventType.SCREEN, data, this.id);
	}
}
