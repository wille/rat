abstract class AbstractView {

	public tab: HTMLElement;
	public viewElement: HTMLElement;

	constructor(public url: string, public title: string) {

	}

	abstract onEnter();
	abstract onLeave();

	public  getElementById(id: string): HTMLElement {
		let elements = this.viewElement.getElementsByClassName(id);
		
		if (elements && elements.length == 1) {
			return <HTMLElement>elements[0];
		} else {
			throw new Error("more than one element found");
		}
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
