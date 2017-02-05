/// <reference path="view.ts" />

class DirectoryView extends View {

	private currentDirectory: string;

	constructor(id: number, private separator: string) {
		super("static/files.html", "File Browser", id);
	}

	onEnter() {
		Control.addEvent(Control.EventType.DIRECTORY, new DirectoryEvent(this, this.id));
		this.backElement.onclick = () => this.back();

		let element = document.getElementById("upload");
		element.onclick = () => this.upload();

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

	private upload() {
		let form = document.createElement("form");

		let dir = document.createElement("input");
		dir.setAttribute("type", "hidden");
		dir.setAttribute("name", "directory");
		dir.setAttribute("value", this.current);
		form.appendChild(dir);

		let id = document.createElement("input");
		id.setAttribute("type", "hidden");
		id.setAttribute("name", "id");
		id.setAttribute("value", String(this.id));
		form.appendChild(id);

		let input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("name", "file");
		form.appendChild(input);

		input.onchange = (event) => {
			let file = input.files[0];
			console.log(file);

			let req = new XMLHttpRequest();
			req.addEventListener("progress", (progressEvent) => {
				if (progressEvent.lengthComputable) {
					let percentComplete = progressEvent.loaded / progressEvent.total;
					console.log(percentComplete + "%");
				} else {
					console.log(progressEvent);
				}
			});
			req.addEventListener("load", () => {
				console.log("Transfer complete");
			});
			req.addEventListener("error", (errorEvent) => {
				console.log(errorEvent);
			});
			req.open("post", "/upload");
			req.send(new FormData(form));
		};
		input.click();

		let data = JSON.stringify({
			"path": this.current
		});
	}
}
