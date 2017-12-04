import Client from "../../client";
import TabbedView from "./TabPage";

export default abstract class ClientPage extends TabbedView {

    constructor(title: string, protected readonly client: Client) {
        super(title);
    }
}
