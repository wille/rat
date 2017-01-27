class ScreenEvent implements Control.IncomingEvent {

	constructor(private element: HTMLImageElement, private id: number) { }

	public emit(data) {
		this.element.src = "data:image/jpg;base64," + data;
	}
}
