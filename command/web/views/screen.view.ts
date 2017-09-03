class ScreenView extends SubView {

	private fps: HTMLElement;
	private screenElement;
	private screenEvent: ScreenEvent;
	
	private scaleSlider: Slider;

	private moveMouse: boolean;
	private keyboard: boolean;

	public selectedMonitor: number;

	constructor(client: Client) {
		super("static/screen.html", "Screen", client);

		this.fps = document.createElement("p");
	}

	public onEnter() {
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
		Control.addEvent(Control.MessageType.MONITOR, new MonitorEvent(this));

		// Setup input events
		this.screenElement = <HTMLImageElement>super.getElementById("screen");
		this.screenElement.onmousemove = (event: MouseEvent) => this.mouseMotionEvent(event);

		this.screenElement.onmousedown = (event) => this.mouseEvent(event.button, InputState.PRESS);
		this.screenElement.onmouseup = (event) => this.mouseEvent(event.button, InputState.RELEASE);

		document.onkeydown = (event) => this.keyEvent(event.keyCode, InputState.PRESS);
		document.onkeyup = (event) => this.keyEvent(event.keyCode, InputState.RELEASE);

		// Setup screen event
		this.screenEvent = new ScreenEvent(this.screenElement, (fps) => {
			// Set FPS label text
			this.fps.innerHTML = fps + " FPS";
		});
		Control.addEvent(Control.MessageType.SCREEN, this.screenEvent);

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

	public onLeave() {
		Control.removeEvent(Control.MessageType.SCREEN);
		Control.removeEvent(Control.MessageType.MONITOR);

		Statusbar.removeElement(this.fps);

		Control.instance.send(new ScreenMessage({ active: false } as ScreenMessageParameters), this.client);

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

	private mouseMotionEvent(event: MouseEvent) {
		if (this.moveMouse) {
			let params: MouseMotionMessageParameters = {
				monitorId: this.selectedMonitor,
				x: event.offsetX / (this.scale / 100),
				y: event.offsetY / (this.scale / 100)
			};

			Control.instance.send(new MouseMotionMessage(params), this.client);
		}
	}

	private mouseEvent(button: MouseButton, event: InputState) {
		if (this.moveMouse) {
			let params: MouseInputMessageParameters = {
				monitorId: this.selectedMonitor,
				button: button,
				state: event
			};

			Control.instance.send(new MouseInputMessage(params), this.client);
		}
	}

	private keyEvent(keyCode: number, event: InputState) {
		if (this.keyboard && keyCode !== 255) {
			let params: KeyMessageParameters = {
				keyCode: keyCode,
				state: event
			};

			Control.instance.send(new KeyMessage(params), this.client);
		}
	}

	// Sends screen event with new configuration
	public initStream() {
		let params: ScreenMessageParameters = {
			active: true,
			scale: this.scale / 100,
			monitor: this.selectedMonitor
		};

		Control.instance.send(new ScreenMessage(params), this.client);
	}
}
