import * as React from "react";
import { Table } from "react-bootstrap";

import { MessageType } from "../../../../shared/src/types";
import Client from "../../client";
import * as EventHandler from "../../messages";
import ViewController from "../../viewController";
import ClientComponent from "../clientComponent";
import ClientRow from "./ClientRow";

interface Props {
    viewController: ViewController;
}

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

export default class Clients extends ClientComponent<Props, State> {

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
                    {this.state.clients.map((client) => {
                        return (
                            <ClientRow key={client.id} client={client} viewController={this.props.viewController}/>
                        );
                    })}
                </tbody>
            </Table>
        );
    }
}
