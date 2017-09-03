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
}

class DirectoryView extends SubView {

	private currentDirectory: string;
	private separator: string;

	constructor(client: Client) {
		super("static/files.html", "File Browser", client);

		this.separator = client.separator;
	}

	public onEnter() {
		Control.addEvent(Control.MessageType.DOWNLOAD, new DownloadEvent());
		Control.addEvent(Control.MessageType.DIRECTORY, new DirectoryEvent(this));

		this.backElement.onclick = () => this.back();

		let uploadElement = this.getElementById("upload");
		uploadElement.onclick = () => this.upload();

		this.browse("");

		let searchElement = <HTMLInputElement>this.getElementById("search");
		new TableSearch(searchElement, this.table);

		let menu = new DirectoryContextMenu(this);
		menu.hook();
	}

	public onLeave() {
		Control.removeEvent(Control.MessageType.DOWNLOAD);
		Control.removeEvent(Control.MessageType.DIRECTORY);
	}

	public get current(): string {
		return this.currentDirectory;
	}

	public set current(dir: string) {
		this.currentDirectory = dir;
	}

	private get backElement(): HTMLElement {
		return this.getElementById("back");
	}

	public get table(): HTMLTableElement {
		return this.getElementById("files") as HTMLTableElement;
	}

	public getSelectedFiles(): string[] {
		let rows = this.table.rows;

		let selected = [];

		for (let i = 0; i < rows.length; i++) {
			let row = rows[i];

			if (row.className === "selected" && !row.hidden) {
				selected.push(this.current + row.children[0].innerHTML);
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

	public browse(path: string, absolute?: boolean) {
		if (!this.current) {
			this.current = "";
		}

		if (this.separator === "/" && this.current === "" && path === "") {
			this.current = "/";
		}

		if (path !== "") {
			if (absolute) {
				this.current = path;
			} else {
				path = this.current + path + this.separator;
				this.current = path;
			}
		}

		let paths = path.split(this.separator);

		if (this.separator === "/") {
			paths = paths.splice(0, 1);
		}

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

		Control.instance.send(new DirectoryMessage(path), this.client);
	}

	public reload() {
		Control.instance.send(new DirectoryMessage(this.current), this.client);
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
		id.setAttribute("value", String(this.client.id));
		form.appendChild(id);

		let input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("name", "file");
		input.setAttribute("multiple", "multiple");
		form.appendChild(input);

		main.setActiveView(MainViewContainer.transfersView);

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

			setTimeout(() => {
				Control.instance.send(new DownloadMessage(file), this.client);
			}, interval);
		}
	}

	public delete() {
		for (let file of this.getSelectedFiles()) {
			if (confirm("Are you sure that you want to delete \"" + file + "\"?")) {
				this.fileEvent(FileAction.UNLINK, file);
			}
		}

		this.reload();
	}

	public fileEvent(action: FileAction, file: string, destination?: string) {
		let params: FileMessageParameters = {
			action: action,
			file: file
		}

		if (destination) {
			params.destination = destination;
		}

		Control.instance.send(new FileMessage(params), this.client);
	}
}
