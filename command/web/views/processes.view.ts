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
		this.table = <HTMLTableElement>this.getElementById("processes");

		Control.addEvent(Control.EventType.PROCESS, new ProcessEvent(this.table, this.id));
		this.update();

		let killElement = this.getElementById("kill");
		killElement.onclick = () => this.kill();

		let spawnElement = this.getElementById("spawn");
		spawnElement.onclick = () => this.spawn();

		let searchElement = <HTMLInputElement>this.getElementById("search");
		new TableSearch(searchElement, this.table);
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

	private update() {
		this.send(ProcessRequestType.QUERY)
	}

	private kill() {
		this.send(ProcessRequestType.KILL, this.getSelectedProcesses());
	}
	
	private spawn() {
		showDialog(new SpawnDialog(this.id));
	}
}
