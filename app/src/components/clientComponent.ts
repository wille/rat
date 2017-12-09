import Client from "@app/client";
import MessageHandler, * as EventHandler from "@messages/index";
import { MessageType } from "@shared/types";
import * as React from "react";

interface Props {
    client: Client;
}

abstract class ClientComponent<P = {}, S = {}> extends React.Component<P & Props, S> {

    public title = "title";
    public id = Math.random();
    private subscriptions: number[] = [];

    constructor(props: P & Props) {
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
