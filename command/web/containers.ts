/// <reference path="view.ts" />
/// <reference path="index.view.ts" />
/// <reference path="transfers.view.ts" />

class MainViewContainer extends TabbedView<MainView> {

	constructor() {
		super(mainViewContainer, mainViewElement, mainViewTabs);
		
        let index = new IndexView();

		this.setView(index);
		this.setView(new BuildView());
        this.setView(new TransfersView());

        this.setActiveView(index);
	}

    public setView(view: SubView) {
        // No subviews currently visible, display subview
		if (this.isEmpty()) {
			$(this.container).show();
		}

        if (this.isEmpty() && sub && sub.views.length > 0) {
            initViews();
        }

        super.setView(view);
    }

    public closeView(view: SubView) {
        super.closeView(view);

        if (this.views.length == 0) { // No tabs left open
			$(this.container).hide();
		}

        if (this.isEmpty() && sub.views.length > 0) {
            removeSplitters();
        }
    }
}

class SubViewContainer extends TabbedView<SubView> {

	constructor() {
		super(subViewContainer, subViewElement, subViewTabs);
	}

    public setView(view: SubView) {
        // No subviews currently visible, display subview
		if (this.isEmpty()) {
			$(this.container).show();
		}

        if (this.isEmpty() && main && main.views.length > 0) {
            initViews();
        }

        super.setView(view);
    }

    public closeView(view: SubView) {
        super.closeView(view);

        if (this.views.length == 0) { // No tabs left open
			$(this.container).hide();
		}

        if (this.isEmpty() && main.views.length > 0) {
            removeSplitters();
        }
    }
}

let main = new MainViewContainer();
let sub = new SubViewContainer();

function setMainView(view: MainView) {
	main.setView(view);
}

function setSubView(view: SubView) {
	sub.setView(view);
}

function removeSplitters() {
	if (split) {
		split.destroy();
			
		// Remove gutters left over by SplitJS
		let gutters = viewContainer.getElementsByClassName("gutter");

		for (let i = 0; i < gutters.length; i++) {
			viewContainer.removeChild(gutters[i]);
		}
	}
}

// Helper functions to make it simple to call from HTML onclick or similar
function setScreenView(id: number) {
	setSubView(new ScreenView(id));
}

function setProcessesView(id: number) {
	setSubView(new ProcessView(id));
}

function setDirectoryView(id: number, separator: string) {
	setSubView(new DirectoryView(id, separator));
}

function setBuildView() {
	setMainView(new BuildView());
}

function setTransfersView() {
	setSubView(new TransfersView());
}

function setLoginView() {
	setMainView(new LoginView());
}
