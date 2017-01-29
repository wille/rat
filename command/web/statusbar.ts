namespace Statusbar {

	let statusbar = <HTMLDivElement>document.getElementById("statusbar");

	export function addElement(element: HTMLElement) {
		statusbar.appendChild(element);
	}

	export function removeElement(element: HTMLElement) {
		statusbar.removeChild(element);
	}
}
