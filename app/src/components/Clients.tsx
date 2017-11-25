import * as React from "react";

import { MessageType } from "../../../shared/src/types";
import Client from "../client";
import * as EventHandler from "../messages";
import ClientComponent from "./clientComponent";

interface State {
    clients: Client[];
}

export default class Clients extends ClientComponent<any, State> {

    public state: State = {
        clients: []
    };

    constructor(props: any) {
        super(props);

        this.subscribe(MessageType.Client, new EventHandler.ClientHandler(this));
    }

    public render() {
        return (
            <table>
                {this.state.clients.map((client) => {
                    return (
                        <tr key={client.id}>
                            <td>{client.host}</td>
                            <td>{client.computerName}</td>
                        </tr>
                    );
                })}
            </table>
        );
    }
}
