import TabPage from "src/components/tabs/TabPage";

import App from "./App";
import ClientComponent from "./components/clientComponent";

export default class ViewController {

    public views: TabPage[] = [];
    public selected: TabPage;

    constructor(private parent: App) {

    }

    public addView(view: TabPage) {
        this.views.push(view);
        this.parent.setState({
            views: this.views
        });
        this.selected = view;
    }
}
