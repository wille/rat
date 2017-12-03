import * as React from "react";

import StreamMessage from "../../../../shared/src/messages/stream";
import { MessageType } from "../../../../shared/src/types";
import { ScreenHandler } from "../../messages";
import ClientComponent from "../clientComponent";

interface State {
    data: string;
}

export default class Screen extends ClientComponent<{}, State> {

    public state: State = {
        data: null
    };

    public componentDidMount() {
        this.subscribe(MessageType.Screen, new ScreenHandler(this));

        this.client.send(new StreamMessage({
            id: this.client.id,
            active: true,
            scale: 1,
            monitor: true,
            handle: 0
        }));
    }

    public render() {
        return (
            <img src={this.state.data}/>
        );
    }
}
