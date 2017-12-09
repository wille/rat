import Client from "@app/client";
import ViewController from "@app/viewController";
import FilePage from "@components/tabs/FilePage";
import ScreenPage from "@components/tabs/ScreenPage";
import * as React from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";

import { Screen } from "../screen";

interface Props {
    viewController: ViewController;
    client: Client;
}

export default class ClientRow extends React.Component<Props, any> {

    public render() {
        const { client } = this.props;
        const flagIcon = require("../../assets/flags/" + (client.flag || "unknown") + ".png");
        const osIcon = require("../../assets/os/" + (this.getOperatingSystemIcon() || "os_linux") + ".png");
        const pingIcon = require("../../assets/ping/" + (this.getPingIcon() || "ping5") + ".png");

        return (
            <ContextMenuTrigger id={client.id} renderTag="tr">
                <td>
                    <img src={flagIcon}/>
                </td>
                <td>{client.host}</td>
                <td>{client.identifier}</td>
                <td>
                    {<img src={osIcon}/>}
                </td>
                <td>
                    {client.os ? client.os.display : "unknown"}
                </td>
                <td>
                    <img src={pingIcon}/>
                </td>

                <ContextMenu id={client.id}>
                    <MenuItem onClick={() => { this.props.viewController.addView(new ScreenPage(client)); }}>
                        View Screen
                    </MenuItem>
                    <MenuItem onClick={() => { this.props.viewController.addView(new FilePage(client)); }}>
                        File System
                    </MenuItem>
                </ContextMenu>
            </ContextMenuTrigger>
        );
    }

    private getOperatingSystemIcon(): string {
        const { client } = this.props;
        const os = client.os ? client.os.display : null;

        if (os === null) {
            return;
        }

        const args = os.split(" ");

        // windows, macos, linux...
        const type = args[0].toLowerCase();

        // (Windows) 10, (macOS) 10.12
        const version = args.length >= 2 ? args[args.length - 1] : null;

        let icon: string;

        switch (type) {
        case "windows":
        case "linux":
            icon = "os_" + type;
            break;
        case "mac": // Mac OS X
        case "macos":
            icon = "os_mac";
            break;
        case "debian":
        case "ubuntu":
        case "opensuse":
        case "mint":
        case "gentoo":
        case "fedora":
        case "centos":
        case "arch":
        case "kali":
            icon = "dist_" + type;
            break;
        default:
            icon = "unknown";
            break;
        }

        return icon;
    }

    private getPingIcon() {
        const { client } = this.props;
        const ms = client.ping;
        let n;

        if (ms < 100) {
            n = 0;
        } else if (ms < 150) {
            n = 1;
        } else if (ms < 250) {
            n = 2;
        } else if (ms < 350) {
            n = 3;
        } else if (ms < 500) {
            n = 4;
        } else {
            n = 5;
        }

        return "ping" + n;
    }

}
