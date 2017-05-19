abstract class AbstractView {

	public tab: HTMLElement;
	public viewElement: HTMLElement;

	constructor(public url: string, public title: string) { }

	abstract onEnter();
	abstract onLeave();
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

let mainViewContainer = document.getElementById("first");
let subViewContainer = document.getElementById("second");
let mainViewElement = document.getElementById("view-main");
let subViewElement = document.getElementById("view-sub");

let mainViewTabs = document.getElementById("mainview-tabs");
let subViewTabs = document.getElementById("subview-tabs");

// Views
let viewContainer = document.getElementById("views-parent");
let currentMainView: MainView;

let split;

function initViews() {
	split = Split(['#first', '#second'], {
		sizes: [
			0,
			100
		],
		direction: "horizontal",
		minSize: 0
	});
}

class TabbedView<T extends AbstractView> {

	public views: T[] = [];

	constructor(protected container, protected viewElement, protected tabs) {

	}

	protected isEmpty() {
		return this.views.length == 0;
	}

	public setView(view: T) {
		this.views.push(view);

		// Create element for the view and load it
		let viewElement = document.createElement("div");
		$(viewElement).load(view.url, (response, status) => {
			Connection.setConnectionStatus(status !== "error");
			view.onEnter();
		});
		view.viewElement = viewElement;

		// Add the view to the subview
		this.viewElement.appendChild(viewElement);

		// Add tab
		this.addTab(view);

		document.title = view.title;
	}

	private addTab(view: T) {
		let tab = document.createElement("li");
		tab["role"] = "presentation";
		tab.className = "active";

		let a = document.createElement("a");
		a.innerText = view.title;
		a.onclick = () => {
			this.setActiveView(view);
		};
		tab.appendChild(a);
		
		this.tabs.appendChild(tab);

		view.tab = tab;

		this.setActiveView(view);
	}

	public setActiveView(view: T) {
		for (let subview of this.views) {
			subview.tab.className = "";
			subview.viewElement.hidden = true;
		}

		view.tab.className = "active";
		view.viewElement.hidden = false;
	}
	
	public closeView(view: T) {
		let index = this.views.indexOf(view);
		
		// New array since delete keeps indexes
		let temp: T[] = [];
		for (let i = 0; i < this.views.length; i++) {
			if (i != index) {
				temp.push(this.views[i]);
			}
		}
		
		this.views = temp;

		let tabs = document.getElementById("subview-tabs");
		tabs.removeChild(view.tab);
		
		this.viewElement.removeChild(view.viewElement);

		// Select nearest tab
		if (index == 0 && this.views.length != 1) {
			index++;
		} else {
			while (index >= 0 && !this.views[index]) {
				index--;
			}
		}

		if (this.views.length > 0) {
			this.setActiveView(this.views[index]);
		}
	}
}
