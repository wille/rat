/// <reference path="view.ts" />

class DirectoryView extends View {

	private element;
	private current: string;

	constructor(id: number) {
		super("static/files.html", "File Browser", id);
	}

	onEnter() {
		Control.addEvent(Control.EventType.DIRECTORY, new DirectoryEvent(this, this.id));

		this.browse("C:");
	}

	onLeave() {
		Control.removeEvent(Control.EventType.DIRECTORY);
	}

	public get table(): HTMLTableElement {
		if (!this.element) {
			this.element = document.getElementById("files");
		}
		return this.element;
	}

	public browse(path: string) {
		if (!this.current) {
			this.current = "";
		}

		path = this.current + path + "/";

		this.current = path;

		let data = JSON.stringify({
			"path": path
		});

		Control.instance.write(Control.EventType.DIRECTORY, data, this.id);
		document.title = this.title + " (" + path + ")";
	}
}
