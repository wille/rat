/// <reference path="view.ts" />

class ProcessView extends View {

	constructor(id: number) {
		super("static/processes.html", "Processes", id);
	}

	onEnter() {
		let element = <HTMLTableElement>document.getElementById("processes");

		Control.addEvent(Control.EventType.PROCESS, new ProcessEvent(element, this.id));
		Control.instance.write(Control.EventType.PROCESS, "", this.id);

		let killElement = document.getElementById("kill");
		killElement.onclick = () => this.kill();
	}

	onLeave() {
		Control.removeEvent(Control.EventType.PROCESS);
	}

	public getSelectedProcesses() {
		let elements = document.getElementsByTagName("tr");

		let selected = [];

		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];

			if (element.className === "selected") {
				selected.push(element.children[0].innerHTML);
			}
		}

		return selected;
	}

	private kill() {
		for (let pid of this.getSelectedProcesses()) {
			console.log(pid);
		}
	}
}
