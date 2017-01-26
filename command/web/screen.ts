/// <reference path="control.ts" />
/// <reference path="view.ts" />

class ScreenEvent implements Control.IncomingEvent {

	constructor(private element: HTMLImageElement, private id: number) { }

	public emit(data) {
		this.element.src = "data:image/jpg;base64," + data;
	}
}

class ScreenView extends View {

	constructor(id: number) {
		super("static/screen.html", id);
	}

	onEnter() {
		let element = <HTMLImageElement>document.getElementById("screen");

		Control.addEvent(Control.EventType.SCREEN, new ScreenEvent(element, this.id));
		Control.instance.write(Control.EventType.SCREEN, "true", this.id);
	}

	onLeave() {
		Control.removeEvent(Control.EventType.SCREEN);
		Control.instance.write(Control.EventType.SCREEN, "false", this.id);
	}
}
