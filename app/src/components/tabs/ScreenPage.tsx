import ClientView from "@components/tabs/ClientView";
import * as React from "react";

import Client from "@app/client";
import { Screen } from "../screen";

export default class ScreenPage extends ClientView {

    constructor(client: Client) {
        super("Screen", client);
    }

    public render() {
        return (
            <Screen client={this.client}/>
        );
    }
}
