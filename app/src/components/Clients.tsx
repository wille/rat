import * as React from "react";

import { MessageType } from "../../../shared/src/types";
import Client from "../client";
import * as EventHandler from "../messages";
import ClientComponent from "./clientComponent";

import ClientRow from "./ClientRow";

interface State {
    clients: Client[];
}

export default class Clients extends ClientComponent<any, State> {

    public state: State = {
        clients: []
    };

    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {
        this.subscribe(MessageType.Client, new EventHandler.ClientHandler(this));
    }

    public render() {
        return (
            <table>
                <tbody>
                    {this.state.clients.map((client) => <ClientRow key={client.id} client={client}/>)}
                </tbody>
            </table>
        );
    }
}
