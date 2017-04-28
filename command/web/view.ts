abstract class AbstractView {

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

// Current active view
let currentView: AbstractView;

function setView(view: AbstractView) {
	if (currentView !== undefined) {
		currentView.onLeave();
	}

	if (view instanceof MainView) {
		$("#subview_toolbar").hide();
	} else if (view instanceof SubView) {
		$("#subview_toolbar").show();
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

function setDirectoryView(id: number, separator: string) {
	setView(new DirectoryView(id, separator));
}

function setBuildView() {
	setView(new BuildView());
}

function setTransfersView() {
	setView(new TransfersView());
}

function setLoginView() {
	setView(new LoginView());
}