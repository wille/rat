import Process from "@components/Process";
import * as React from "react";

import Client from "../../client";
import TabbedView from "./TabPage";

export default class ProcessPage extends TabbedView {

    constructor(private client: Client) {
        super("Processes");
    }

    public render() {
        return (
            <Process client={this.client}/>
        );
    }
}
