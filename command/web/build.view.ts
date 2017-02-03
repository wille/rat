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

	private get host() {
		let element = <HTMLInputElement>document.getElementById("host");
		return element.value;
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

	private build() {
		let data = {
			"host": this.host,
			"os": this.os,
			"arch": this.arch,
			"delay": this.delay
		};

		let log = document.getElementById("log");
		log.innerHTML = "";

		$.post("/build", JSON.stringify(data), (response: string) => {
			log.innerHTML += response;
		}, "text");
	}
}