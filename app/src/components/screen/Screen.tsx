import * as React from "react";

import StreamMessage from "../../../../shared/src/messages/stream";
import { MessageType } from "../../../../shared/src/types";
import { ScreenHandler } from "../../messages";
import ClientComponent from "../clientComponent";

export default class Screen extends ClientComponent<any, any> {

    constructor(props: any) {
        super(props);

        this.subscribe(MessageType.Screen, new ScreenHandler(this));
    }

    public componentDidMount() {
        this.client.send(new StreamMessage({
            id: this.client.id,
            active: true,
            scale: 0.5,
            monitor: true,
            handle: 0
        }));
    }

    public render() {
        return (
            <p>Screen</p>
        );
    }
}
