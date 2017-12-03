import * as React from "react";

import Client from "../../client";
import { Screen } from "../screen";
import TabPage from "./TabPage";

export default class ScreenPage extends TabPage {

    constructor(private client: Client) {
        super("Screen");
    }

    public render() {
        return (
            <Screen client={this.client}/>
        );
    }
}
