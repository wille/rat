abstract class AbstractView {

	public tab: HTMLElement;
	public viewElement: HTMLElement;

	constructor(public url: string, public title: string) {

	}

	abstract onEnter();
	abstract onLeave();

	public getElementById(id: string): HTMLElement {
		let elements = this.viewElement.getElementsByTagName("*");

		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			if (element.getAttribute("id") === id) {
				return <HTMLElement>element;
			}
		}

		throw new Error("element " + id + " not found");
	}
}

abstract class MainView extends AbstractView {

	constructor(url: string, title: string) {
		super(url, title);
	}

	abstract onEnter();
	abstract onLeave();
}

abstract class SubView extends AbstractView {

	constructor(url: string, title: string, public id?: number) {
		super(url, title);
	}

	abstract onEnter();
	abstract onLeave();
}
