import TabbedView from "src/components/tabs/TabPage";

import App from "./App";
import ClientComponent from "./components/clientComponent";

export default class ViewController {

    public views: TabbedView[] = [];

    constructor(private parent: App) {

    }

    public addView(view: TabbedView) {
        this.views.push(view);
        this.parent.setState({
            views: this.views,
            selected: view
        });
    }
}
