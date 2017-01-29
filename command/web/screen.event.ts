class ScreenEvent implements Control.IncomingEvent {

	private fps = 0;
	private interval: number;

	constructor(private element: HTMLImageElement, private id: number, private callback: any) {
		this.interval = setInterval(() => {
			callback(this.fps);
			this.fps = 0;
		}, 1000);
	}

	public emit(data) {
		this.element.src = "data:image/jpg;base64," + data;
		this.fps++;
	}

	public stop() {
		clearInterval(this.interval);
	}
}
