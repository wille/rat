abstract class AbstractView {

	public tab: HTMLElement;
	public viewElement: HTMLElement;

	constructor(public url: string, public title: string) {

	}

	public abstract onEnter();
	public abstract onLeave();

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

	public abstract onEnter();
	public abstract onLeave();
}

abstract class SubView extends AbstractView {

	constructor(url: string, title: string, public client?: Client) {
		super(url, title);
	}

	public abstract onEnter();
	public abstract onLeave();
}
