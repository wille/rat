import * as React from "react";

import Client from "../../client";
import FileSystem from "../fs/FileSystem";
import TabbedView from "./TabPage";

export default class FilePage extends TabbedView {

    constructor(private client: Client) {
        super("File System");
    }

    public render() {
        return (
            <FileSystem client={this.client}/>
        );
    }
}
