import Client from "../../client";
import TabPage from "./TabPage";

export default abstract class ClientPage extends TabPage {

    constructor(title: string, protected readonly client: Client) {
        super(title);
    }
}
