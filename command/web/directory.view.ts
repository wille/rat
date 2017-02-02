/// <reference path="view.ts" />

class DirectoryView extends View {

	private currentDirectory: string;

	constructor(id: number, private separator: string) {
		super("static/files.html", "File Browser", id);
	}

	onEnter() {
		Control.addEvent(Control.EventType.DIRECTORY, new DirectoryEvent(this, this.id));
		this.backElement.onclick = () => this.back();

		this.browse("");
	}

	onLeave() {
		Control.removeEvent(Control.EventType.DIRECTORY);
	}

	private get current(): string {
		return this.currentDirectory;
	}

	private set current(dir: string) {
		this.currentDirectory = dir;
		this.directoryElement.value = dir;
	}

	private get backElement(): HTMLElement {
		return document.getElementById("back");
	}

	public get directoryElement(): HTMLInputElement {
		return <HTMLInputElement>document.getElementById("dir");
	}

	public get table(): HTMLTableElement {
		return <HTMLTableElement>document.getElementById("files");
	}

	public back() {
		let path = this.current;

		if (path.charAt(path.length - 1) === this.separator) {
			path = path.substring(0, path.length - 1);
		}

		path = path.substring(0, path.lastIndexOf(this.separator));

		this.current = null;
		this.browse(path);
	}

	public browse(path: string) {
		if (!this.current) {
			this.current = "";
		}

		if (path !== "") {
			path = this.current + path + this.separator;
			this.current = path;

			document.title = this.title + " (" + path + ")";
		} else {
			document.title = this.title;
		}

		let data = JSON.stringify({
			"path": path
		});

		Control.instance.write(Control.EventType.DIRECTORY, data, this.id);
	}
}
