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
                <td>{client.computerName}</td>
            </tr>
        );
    }
}
