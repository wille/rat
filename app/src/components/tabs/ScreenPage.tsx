import * as React from "react";

import Client from "../../client";
import { Screen } from "../screen";
import TabbedView from "./TabPage";

export default class ScreenPage extends TabbedView {

    constructor(private client: Client) {
        super("Screen");
    }

    public render() {
        return (
            <Screen client={this.client}/>
        );
    }
}
