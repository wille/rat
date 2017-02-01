interface IView {
	onEnter();
	onLeave();
}

abstract class View implements IView {
	constructor(public url: string, public title: string, public id?: number) { }

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

	document.title = view.title;
}

// Helper functions to make it simple to call from HTML onclick or similar
function setMainView() {
	setView(new IndexView());
}

function setScreenView(id: number) {
	setView(new ScreenView(id));
}

function setProcessesView(id: number) {
	setView(new ProcessView(id));
}

function setDirectoryView(id: number) {
	setView(new DirectoryView(id));
}
