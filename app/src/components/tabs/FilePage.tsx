import * as React from "react";

import Client from "../../client";
import FileSystem from "../fs/FileSystem";
import ClientView from "./ClientView";

export default class FilePage extends ClientView {

    constructor(client: Client) {
        super("File System", client);
    }

    public render() {
        return (
            <FileSystem client={this.client}/>
        );
    }
}
