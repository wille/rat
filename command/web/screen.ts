/// <reference path="control.ts" />

class ScreenEvent implements Control.IncomingEvent {

	constructor(private element: HTMLImageElement, private id: number) { }

	public emit(data) {
		this.element.src = "data:image/jpg;base64," + data;
	}
}

function startStream(element: HTMLImageElement, id: number) {
	Control.addEvent(Control.EventType.SCREEN, new ScreenEvent(element, id));

	Control.init(() => {
		Control.instance.write(Control.EventType.SCREEN, "true", id);
	});
}