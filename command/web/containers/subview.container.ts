/// <reference path="tabbed.container.ts" />

class SubViewContainer extends TabbedContainer<SubView> {

	constructor() {
		super(subViewContainer, subViewElement, subViewTabs);
	}

    public setView(view: SubView) {
        // No subviews currently visible, display subview
		if (this.isEmpty()) {
			$(this.container).show();
		}

        if (this.isEmpty() && main && main.views.length > 0) {
            viewSplitter.create();
        }

        super.setView(view);
    }

    public closeView(view: SubView) {
        super.closeView(view);

        if (this.views.length == 0) { // No tabs left open
			$(this.container).hide();
		}

        if (this.isEmpty() && main.views.length > 0) {
            viewSplitter.destroy();
        }
    }
}


function setMainView(view: MainView) {
	main.setView(view);
}

function setSubView(view: SubView) {
	sub.setView(view);
}
