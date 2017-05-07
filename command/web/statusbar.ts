namespace Statusbar {

	let statusbar = <HTMLDivElement>document.getElementById("statusbar");

	function createSeparator() {
		let element = <HTMLDivElement>document.createElement("div");
		element.className = "separator";
		return element;
	}

	export function addElement(element: HTMLElement) {
		statusbar.appendChild(createSeparator());
		statusbar.appendChild(element);
	}

	export function removeElement(element: HTMLElement) {
		statusbar.removeChild(element);
		statusbar.removeChild(statusbar.childNodes[statusbar.childNodes.length - 1]);
	}

	export function hide() {
		statusbar.hidden = true;
	}

	export function show() {
		statusbar.hidden = false;
	}
}
