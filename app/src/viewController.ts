import App from "@app/App";
import TabbedView from "@components/tabs/TabPage";

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
