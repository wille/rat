import Process from "@components/Process";
import ClientView from "@components/tabs/ClientView";
import * as React from "react";

import Client from "../../client";

export default class ProcessPage extends ClientView {

    constructor(client: Client) {
        super("Processes", client);
    }

    public render() {
        return (
            <Process client={this.client}/>
        );
    }
}
