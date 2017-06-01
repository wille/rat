/**
 * Incoming desktop frame
 */
class ScreenEvent implements Control.IncomingEvent {

	private fps = 0;
	private interval: number;

	constructor(private element: HTMLImageElement, private id: number, private callback: (fps: number) => void) {
		// Report current FPS once a second
		this.interval = setInterval(() => {
			callback(this.fps);
			this.fps = 0;
		}, 1000);
	}

	public emit(data) {
		this.element.src = "data:image/jpg;base64," + data;
		this.fps++;
	}

	// Stop the FPS reporter interval
	public stop() {
		clearInterval(this.interval);
	}
}
