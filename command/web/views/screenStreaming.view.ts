/// <reference path="streaming.view.ts" />

class ScreenView extends StreamingView {

	private moveMouse: boolean;
    private keyboard: boolean;
    
    private readonly keyDownEvent = (event: KeyboardEvent) => this.keyEvent(event.which || event.keyCode, InputState.PRESS);
    private readonly keyUpEvent = (event: KeyboardEvent) => this.keyEvent(event.which || event.keyCode, InputState.RELEASE);

	public selectedMonitor: number;

	constructor(client: Client) {
		super(StreamingType.MONITOR, "screen.html", "Screen", client);
	}

	public onEnter() {
		super.onEnter();

		// Start stream
		this.initStream();

		Control.addEvent(Control.MessageType.MONITOR, new MonitorEvent(this));

		// Setup input events
		this.screenElement = <HTMLImageElement>super.getElementById("screen");
		this.screenElement.onmousemove = (event: MouseEvent) => this.mouseMotionEvent(event);

		this.screenElement.onmousedown = (event) => this.mouseEvent(event.button, InputState.PRESS);
		this.screenElement.onmouseup = (event) => this.mouseEvent(event.button, InputState.RELEASE);

		document.addEventListener("keydown", this.keyDownEvent);
		document.addEventListener("keyup", this.keyUpEvent);

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
		super.onLeave();

		Control.removeEvent(Control.MessageType.MONITOR);

        document.removeEventListener("keydown", this.keyDownEvent);
        document.removeEventListener("keyup", this.keyUpEvent);
	}

	// returns the monitor selector element
	public get monitorsElement(): HTMLElement {
		return super.getElementById("monitors");
	}

	protected get handle(): number {
		return this.selectedMonitor;
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
}
