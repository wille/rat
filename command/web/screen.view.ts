/// <reference path="view.ts" />

class ScreenView extends View {

	constructor(id: number) {
		super("static/screen.html", "Screen", id);
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
