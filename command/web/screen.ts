/// <reference path="control.ts" />
/// <reference path="view.ts" />

class ScreenEvent implements Control.IncomingEvent {

	constructor(private element: HTMLImageElement, private id: number) { }

	public emit(data) {
		this.element.src = "data:image/jpg;base64," + data;
	}
}

let element: HTMLImageElement = <HTMLImageElement>document.getElementById("screen");

class ScreenView extends View {

	constructor(id: number) {
		super("static/screen.html", id);
	}

	onEnter() {
		Control.addEvent(Control.EventType.SCREEN, new ScreenEvent(element, id));
		Control.instance.write(Control.EventType.SCREEN, "true", id);
	}

	onLeave() {
		Control.removeEvent(Control.EventType.SCREEN);
		Control.instance.write(Control.EventType.SCREEN, "false", id);
	}
}
