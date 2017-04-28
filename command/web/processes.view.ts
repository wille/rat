/// <reference path="view.ts" />

enum ProcessRequestType {
	QUERY = 0,
	KILL = 1
}

class ProcessView extends SubView {

	constructor(id: number) {
		super("static/processes.html", "Processes", id);
	}

	onEnter() {
		let element = <HTMLTableElement>document.getElementById("processes");

		Control.addEvent(Control.EventType.PROCESS, new ProcessEvent(element, this.id));
		this.update();

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
				selected.push(Number(element.children[0].innerHTML));
			}
		}

		return selected;
	}

	private send(type: ProcessRequestType, pids?: number[]) {
		let data = {
			"type": type
		};

		if (pids) {
			data["pids"] = pids;
		}

		Control.instance.write(Control.EventType.PROCESS, JSON.stringify(data), this.id);
	}

	private update() {
		this.send(ProcessRequestType.QUERY)
	}

	private kill() {
		this.send(ProcessRequestType.KILL, this.getSelectedProcesses());
	}
}
