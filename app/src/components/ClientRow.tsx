import * as React from "react";

import Client from "../client";

interface Props {
    client: Client;
}

export default class ClientRow extends React.Component<Props, any> {

    public render() {
        const { client } = this.props;

        return (
            <tr key={client.id}>
                <td>
                    <img src={"assets/flags/" + client.flag + ".png"}/>
                </td>
                <td>{client.host}</td>
                <td>{client.identifier}</td>
                <td>
                    <img src={"assets/ping/" + this.getPingIcon() + ".png"}/>
                </td>
            </tr>
        );
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
