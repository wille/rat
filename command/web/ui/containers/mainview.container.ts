/// <reference path="tabbed.container.ts" />

/// <reference path="../views/clients.view.ts" />
/// <reference path="../views/build.view.ts" />
/// <reference path="../views/transfers.view.ts" />

namespace Web.UI.Containers {

    import MainView = Views.MainView;
    import ClientsView = Views.ClientsView;
    import BuildView = Views.BuildView;
    import TransfersView = Views.TransfersView;

    export class MainViewContainer extends TabbedContainer<MainView> {

        public static readonly clientsView = new ClientsView();
        public static readonly buildView = new BuildView();
        public static readonly transfersView = new TransfersView();

        constructor() {
            super(mainViewContainer, mainViewElement, mainViewTabs);

            this.setView(MainViewContainer.clientsView);
            this.setView(MainViewContainer.buildView);
            this.setView(MainViewContainer.transfersView);

            this.setActiveView(MainViewContainer.clientsView);
        }

        public setView(view: MainView) {
            // No subviews currently visible, display subview
            if (this.isEmpty()) {
                $(this.container).show();
            }

            if (this.isEmpty() && sub && sub.views.length > 0) {
                viewSplitter.create();
            }

            super.setView(view);
        }

        public closeView(view: MainView) {
            super.closeView(view);

            if (this.views.length === 0) { // No tabs left open
                $(this.container).hide();
            }

            if (this.isEmpty() && sub.views.length > 0) {
                viewSplitter.destroy();
            }
        }
    }
}
