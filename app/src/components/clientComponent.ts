import * as React from "react";

import { MessageType } from "../../../shared/src/types";
import MessageHandler, * as EventHandler from "../messages";

abstract class ClientComponent<P, S> extends React.Component<P, S> {

    private subscriptions: number[] = [];

    constructor(props: P) {
        super(props);
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
