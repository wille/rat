/// <reference path="view.ts" />

class BuildView extends View {

	constructor() {
		super("static/build.html", "Build");
	}

	onEnter() {
		let button = <HTMLButtonElement>document.getElementById("submit");
		button.onclick = () => this.build();

		let osElement = <HTMLSelectElement>document.getElementById("os");
		osElement.onchange = (event) => {
			let manifestDiv = <HTMLDivElement>document.getElementById("manifest");
			let os = (<HTMLOptionElement>osElement.options[osElement.selectedIndex]).value;

			manifestDiv.hidden = !(os === "all" || os === "windows");

			let x86 = <HTMLOptionElement>document.getElementById("386");
			x86.disabled = os === "macos";
		};

		Control.addEvent(Control.EventType.DOWNLOAD, new DownloadEvent());
	}

	onLeave() {
		Control.removeEvent(Control.EventType.DOWNLOAD);
	}

	private get name() {
		let element = <HTMLInputElement>document.getElementById("name");
		return element.value === "" ? element.placeholder : element.value;
	}

	private get host() {
		let element = <HTMLInputElement>document.getElementById("host");
		return element.value === "" ? element.placeholder : element.value;
	}

	private get os() {
		let element = <HTMLSelectElement>document.getElementById("os");
		let option = <HTMLOptionElement>element.options[element.selectedIndex];
		return option.value;
	}

	private get arch() {
		let element = <HTMLSelectElement>document.getElementById("arch");
		let option = <HTMLOptionElement>element.options[element.selectedIndex];
		return option.value;
	}

	private get delay(): number {
		let element = <HTMLInputElement>document.getElementById("delay");
		return Number(element.value);
	}

	private get invalidCerts(): boolean {
		let element = <HTMLInputElement>document.getElementById("invalidssl");
		return element.checked;
	}

	}

	private build() {
		let os = this.os;

		let data = {
			"host": this.host,
			"os": os,
			"arch": this.arch,
			"delay": this.delay,
			"name": this.name,
			"invalid_ssl": this.invalidCerts
		};

		Control.instance.write(Control.EventType.BUILD, data);
	}
}