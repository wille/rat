/// <reference path="view.ts" />

class ProcessView extends View {

	constructor(id: number) {
		super("static/processes.html", "Processes", id);
	}

	onEnter() {
		let element = <HTMLTableElement>document.getElementById("processes");

		Control.addEvent(Control.EventType.PROCESS, new ProcessEvent(element, this.id));
		Control.instance.write(Control.EventType.PROCESS, "", this.id);
	}

	onLeave() {
		Control.removeEvent(Control.EventType.PROCESS);
	}
}
