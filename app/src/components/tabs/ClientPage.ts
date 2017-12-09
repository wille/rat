import Client from "@app/client";
import TabbedView from "@components/tabs/TabPage";

export default abstract class ClientPage extends TabbedView {

    constructor(title: string, protected readonly client: Client) {
        super(title);
    }
}
