import * as React from "react";

import { MessageType } from "../../../shared/src/types";
import Client from "../client";
import MessageHandler, * as EventHandler from "../messages";

interface Props {
    client: Client;
}

abstract class ClientComponent<S = {}> extends React.Component<Props, S> {

    private subscriptions: number[] = [];

    constructor(props: Props) {
        super(props);
    }

    public get client() {
        return this.props.client as Client;
    }

    public abstract render(): React.ReactNode;

    public componentWillUnmount() {
        this.subscriptions.forEach((s) => {
            EventHandler.unsubscribe(s);
        });
    }

    protected subscribe(type: MessageType, handler: MessageHandler<any>) {
        this.subscriptions.push(EventHandler.subscribe(type, handler));
    }

}

export default ClientComponent;
