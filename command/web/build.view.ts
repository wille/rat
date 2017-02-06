/// <reference path="view.ts" />

class BuildView extends View {

	constructor() {
		super("static/build.html", "Build");
	}

	onEnter() {
		let button = <HTMLButtonElement>document.getElementById("submit");
		button.onclick = () => this.build();
	}

	onLeave() {

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
		let option = <HTMLOptionElement>element.options[element.selectedIndex]
		return option.value;
	}

	private get arch() {
		let element = <HTMLSelectElement>document.getElementById("arch");
		let option = <HTMLOptionElement>element.options[element.selectedIndex]
		return option.value;
	}

	private get delay(): number {
		let element = <HTMLInputElement>document.getElementById("delay");
		return Number(element.value);
	}

	private get upx(): boolean {
		let element = <HTMLInputElement>document.getElementById("upx");
		return Boolean(element.checked);
	}

	private build() {
		let data = {
			"host": this.host,
			"os": this.os,
			"arch": this.arch,
			"delay": this.delay,
			"upx": this.upx,
			"name": this.name
		};

		let log = document.getElementById("log");
		log.innerHTML = "";

		$.post("/build", JSON.stringify(data), (response: string) => {
			log.innerHTML += response;
		}, "text");
	}
}