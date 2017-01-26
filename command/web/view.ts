interface IView {
	onEnter();
	onLeave();
}

abstract class View implements IView {
	constructor(public url: string, public id?: number) { }

	abstract onEnter();
	abstract onLeave();
}

// Current active view
let currentView: View;

function setView(view: View) {
	if (currentView !== undefined) {
		currentView.onLeave();
	}

	currentView = view;
	$("#view").load(view.url, (response, status) => {
		Connection.setConnectionStatus(status !== "error");
		view.onEnter();
	});
}

// Helper functions to make it simple to call from HTML onclick or similar
/// <reference path="index.ts" />
/// <reference path="screen.ts" />
function setMainView() {
	setView(new IndexView());
}

function setScreenView(id: number) {
	setView(new ScreenView(id));
}
