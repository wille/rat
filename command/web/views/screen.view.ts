class ScreenView extends SubView {

	private fps: HTMLElement;
	private screenElement;
	private screenEvent: ScreenEvent;
	
	private scaleSlider: Slider;

	private moveMouse: boolean;
	private keyboard: boolean;

	public selectedMonitor: number;

	constructor(id: number) {
		super("static/screen.html", "Screen", id);

		this.fps = document.createElement("p");
	}

	onEnter() {
		// Initialize slider
		this.scaleSlider = new Slider(super.getElementById("scale"), {
			formatter: (value) => {
				return value + "%";
			}
		});

		// On slider value change, reinit stream
		this.scaleSlider.on("change", () => {
			if (this.scaleSlider) {
				this.initStream();
			}
		});

		// Start stream
		this.initStream();

		// Setup monitor dropdown button
		let monitorsElement = super.getElementById("monitors");
		Control.addEvent(Control.EventType.MONITOR, new MonitorEvent(this));

		// Setup input events
		this.screenElement = <HTMLImageElement>super.getElementById("screen");
		this.screenElement.onmousemove = (event) => {
			if (this.moveMouse) {
				let data = JSON.stringify({
					"id": this.selectedMonitor,
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

		// Setup screen event
		this.screenEvent = new ScreenEvent(this.screenElement, this.id, (fps) => {
			// Set FPS label text
			this.fps.innerHTML = fps + " FPS";
		});
		Control.addEvent(Control.EventType.SCREEN, this.screenEvent);

		Statusbar.addElement(this.fps);

		// Setup mouse and keyboard input toggles
		let mouseToggle = new ToggleButton(super.getElementById("cursor"));
		mouseToggle.onclick = () => {
			this.moveMouse = !this.moveMouse;
		};

		let keyboardToggle = new ToggleButton(super.getElementById("keyboard"));
		keyboardToggle.onclick = (checked) => {
			this.keyboard = checked;
		};
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

	// returns the monitor selector element
	public get monitorsElement(): HTMLElement {
		return super.getElementById("monitors");
	}

	// returns the current scale in percent
	private get scale(): number {
		return this.scaleSlider.getValue();
	}

	// Set badge displaying number of monitors. If just one, hide the badge
	public set monitorCount(count: number) {
		let display = String(count);

		if (count === 0) {
			display = "";
		}

		super.getElementById("monitor-count").innerText = display;
	}

	private mouseEvent(button: Mouse, event: Mouse) {
		if (this.moveMouse) {
			let data = JSON.stringify({
				"id": this.selectedMonitor,
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
	public initStream() {
		let data = JSON.stringify({
			"active": true,
			"scale": this.scale / 100,
			"monitor": this.selectedMonitor
		});

		Control.instance.write(Control.EventType.SCREEN, data, this.id);
	}
}
