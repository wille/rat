/// <reference path="control.ts" />

const SCREEN_ELEMENT_ID: string = "screen";

class ScreenEvent implements Control.IncomingEvent {
	public emit(data) {
		const element: HTMLImageElement = <HTMLImageElement>document.getElementById(SCREEN_ELEMENT_ID)
		element.src = "data:image/jpg;base64," + data;

		console.log("Writing...");
		Control.instance.write(Control.EventType.SCREEN, "testdata", id);
	}
}

Control.addEvent(Control.EventType.SCREEN, new ScreenEvent());
