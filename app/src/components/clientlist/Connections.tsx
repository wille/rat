import * as React from "react";
import { Table } from "react-bootstrap";

import { MessageType } from "../../../../shared/src/types";
import Client from "../../client";
import * as EventHandler from "../../messages";
import ClientComponent from "../clientComponent";
import ClientRow from "./ClientRow";

interface State {
    clients: Client[];
}

const columns = [
    "Country",
    "Host",
    "Identifier",
    "Operating System",
    "Ping"
];

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
            <Table bordered>
                <thead>
                    <tr>
                        {columns.map((column) => <th key={column}>{column}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.state.clients.map((client) => <ClientRow key={client.id} client={client}/>)}
                </tbody>
            </Table>
        );
    }
}
