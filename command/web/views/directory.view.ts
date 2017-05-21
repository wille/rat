enum FileTask {
	// Touch file
	TOUCH = 0,

	// Unlink file
	UNLINK = 1,

	// Move file
	MOVE = 2,

	// Copy file
	COPY = 3
}

class DirectoryContextMenu extends ContextMenu {

	private view: DirectoryView;

	private downloadItem;
	private deleteItem;

	constructor(parent: DirectoryView) {
		super(parent.table, parent.getElementById("menu"));

		this.view = parent;

		this.downloadItem = parent.getElementById("item-download");
		this.downloadItem.onclick = () => parent.download();

		this.deleteItem = document.getElementById("item-remove");
		this.deleteItem.onclick = () => parent.delete();
	}

	onOpen() {

	}

	onClose() {

	}
}

class DirectoryView extends SubView {

	private currentDirectory: string;

	constructor(id: number, private separator: string) {
		super("static/files.html", "File Browser", id);
	}

	onEnter() {
		Control.addEvent(Control.EventType.DOWNLOAD, new DownloadEvent());
		Control.addEvent(Control.EventType.DIRECTORY, new DirectoryEvent(this, this.id));

		this.backElement.onclick = () => this.back();

		let uploadElement = this.getElementById("upload");
		uploadElement.onclick = () => this.upload();

		this.browse("");

		let searchElement = <HTMLInputElement>this.getElementById("search");
		new TableSearch(searchElement, this.table);

		let menu = new DirectoryContextMenu(this);
		menu.hook();

		let closeElement = this.getElementById("close");
		closeElement.onclick = () => {
			sub.closeView(this);
		};
	}

	onLeave() {
		Control.removeEvent(Control.EventType.DOWNLOAD);
		Control.removeEvent(Control.EventType.DIRECTORY);
	}

	public get current(): string {
		return this.currentDirectory;
	}

	public set current(dir: string) {
		this.currentDirectory = dir;
	}

	private get backElement(): HTMLElement {
		return document.getElementById("back");
	}

	public get table(): HTMLTableElement {
		return <HTMLTableElement>document.getElementById("files");
	}

	public getSelectedFiles() {
		let elements = document.getElementsByTagName("tr");

		let selected = [];

		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];

			if (element.className === "selected" && !element.hidden) {
				selected.push(this.current + element.children[0].innerHTML);
			}
		}

		return selected;
	}

	public back(levels: number = 1) {
		let path = this.current;

		for (let i = 0; i < levels; i++) {
			if (path.charAt(path.length - 1) === this.separator) {
				path = path.substring(0, path.length - 1);
			}

			path = path.substring(0, path.lastIndexOf(this.separator));
		}

		this.current = null;
		this.browse(path);
	}

	public browse(path: string, boo?) {
		if (!this.current) {
			this.current = "";
		}

		if (this.separator === "/" && this.current === "" && path === "") {
			this.current = "/";
		}

		if (path !== "") {
			if (boo) {
				this.current = path;
			} else {
				path = this.current + path + this.separator;
				this.current = path;
			}

			document.title = this.title + " (" + path + ")";
		} else {
			document.title = this.title;
		}

		let data = JSON.stringify({
			"path": path
		});


		let paths = path.split(this.separator);

		let breadcrumb = document.getElementById("path");
		breadcrumb.innerHTML = "";
		let root = document.createElement("li");
		breadcrumb.appendChild(root);

		let depth = "";

		for (let i = 0; i < paths.length; i++) {
			let li = document.createElement("li");

			let active = i === paths.length - 2;

			if (active) {
				li.innerHTML = paths[i];
				li.className = "active";
			} else {
				let a = document.createElement("a");
				a.innerHTML = paths[i];
				li.appendChild(a);
			}

			depth += paths[i];

			if (i < paths.length - 1) {
				depth += this.separator;
			}

			let c = depth;
			li.onclick = () => this.browse(c, true);

			breadcrumb.appendChild(li);
		}

		Control.instance.write(Control.EventType.DIRECTORY, data, this.id);
	}

	public reload() {
		let data = JSON.stringify({
			"path": this.current
		});

		Control.instance.write(Control.EventType.DIRECTORY, data, this.id);
	}

	private upload() {
		let form = document.createElement("form");
		form.setAttribute("enctype", "multipart/form-data");

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
		input.setAttribute("multiple", "multiple");
		form.appendChild(input);

		setTransfersView();

		input.onchange = (event) => {
			let file = input.files[0];

			let transfer = new Transfer(false, this.current + file.name, file.name);
			Transfers.addTransfer(transfer);

			let req = new XMLHttpRequest();
			req.addEventListener("progress", (progressEvent) => {
				if (progressEvent.lengthComputable) {
					let percentComplete = progressEvent.loaded / progressEvent.total;
					transfer.progress = percentComplete;
				} else {
					console.log(progressEvent);
				}
			});
			req.addEventListener("load", () => {
				transfer.complete();
			});
			req.addEventListener("error", (errorEvent) => {
				transfer.setStatus(Transfers.Status.FAIL);
			});
			req.open("post", "/upload");
			req.send(new FormData(form));
		};
		input.click();
	}

	public download() {
		setTransfersView();

		let interval = 0;
		for (let file of this.getSelectedFiles()) {
			interval += 1000;

			let transfer = new Transfer(true, file);
			Transfers.addTransfer(transfer);

			let json = JSON.stringify({
				"file": file
			});

			setTimeout(() => {
				Control.instance.write(Control.EventType.DOWNLOAD, json, this.id);
			}, interval);
		}
	}

	public delete() {
		for (let file of this.getSelectedFiles()) {
			if (confirm("Are you sure that you want to delete \"" + file + "\"?")) {
				this.fileEvent(FileTask.UNLINK, file);
			}
		}

		this.reload();
	}

	public fileEvent(task: FileTask, file: string, destination?: string) {
		let data = {
			"task": task,
			"file": file,
		};

		if (destination) {
			data["destination"] = destination;
		}

		Control.instance.write(Control.EventType.FILE, JSON.stringify(data), this.id);
	}
}
