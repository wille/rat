/// <reference path="view.ts" />

enum ProcessRequestType {
	QUERY = 0,
	KILL = 1
}

class ProcessView extends SubView {

	private table: HTMLTableElement;

	constructor(id: number) {
		super("static/processes.html", "Processes", id);
	}

	onEnter() {
		this.table = <HTMLTableElement>document.getElementById("processes");

		Control.addEvent(Control.EventType.PROCESS, new ProcessEvent(this.table, this.id));
		this.update();

		let killElement = document.getElementById("kill");
		killElement.onclick = () => this.kill();

		let searchElement = <HTMLInputElement>document.getElementById("search");
		searchElement.oninput = () => {
			this.search(searchElement.value);
		};
	}

	onLeave() {
		Control.removeEvent(Control.EventType.PROCESS);
	}

	public getSelectedProcesses() {
		let elements = document.getElementsByTagName("tr");

		let selected = [];

		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];

			if (element.className === "selected" && !element.hidden) {
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

	private search(term: string) {
		let elements = this.table.getElementsByTagName("tr");

		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];

			for (let j = 0; j < element.children.length; j++) {
				let child = element.children[j];

				let contains = child.innerHTML.toLowerCase().indexOf(term.toLowerCase()) >= 0;
				
				element.hidden = !contains;

				if (contains) {
					break;
				}
			}
		}
	}

	private update() {
		this.send(ProcessRequestType.QUERY)
	}

	private kill() {
		this.send(ProcessRequestType.KILL, this.getSelectedProcesses());
	}
}
