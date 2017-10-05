/// <reference path="../views/view.ts" />
/// <reference path="mainview.container.ts" />
/// <reference path="subview.container.ts" />

namespace Web.UI.Containers {

    import SubView = Views.SubView;
    import MainView = Views.MainView;

    export const viewContainer = document.getElementById("views-parent");
    export const mainViewContainer = document.getElementById("first");
    export const subViewContainer = document.getElementById("second");

    export const mainViewTabs = document.getElementById("mainview-tabs");
    export const subViewTabs = document.getElementById("subview-tabs");

    export const mainViewElement = document.getElementById("view-main");
    export const subViewElement = document.getElementById("view-sub");

    export const main = new MainViewContainer();
    export const sub = new SubViewContainer();

    export function setMainView(view: MainView) {
        main.setActiveView(view);
    }

    export function setSubView(view: SubView) {
        sub.setView(view);
    }

    export function blockView(view: MainView) {
        main.setView(view);
        $(mainViewTabs).hide();
        $(subViewContainer).hide();
    }

    /**
     * Sets both containers visible
     */
    export function unblockView(view: MainView) {
        $(mainViewTabs).show();
        $(subViewContainer).show();
        main.closeView(this);
        main.setActiveView(MainViewContainer.clientsView);
    }
}
