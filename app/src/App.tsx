import * as React from "react";

import * as EventHandler from "./messages";

import { MessageType } from "shared/types";

import Client from "./client";

interface State {
    clients: any[];
}

export default class App extends React.Component<any, State> {

    public state: State = {
        clients: []
    };

    public componentWillMount() {
        EventHandler.subscribe(MessageType.Client, new EventHandler.ClientHandler());
    }

    public render() {
        return (
            <table>
                {this.state.clients.map((client) => {
                    return (
                        <tr key={client.username}>
                            <td>{client.username}</td>
                            <td>{client.operatingsystemdisplayname}</td>
                        </tr>
                    );
                })}
            </table>
        );
    }
}
