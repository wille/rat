import * as React from "react";

import ScreenMessage from "../../../../shared/src/messages/screen";
import { MessageType } from "../../../../shared/src/types";
import { ScreenHandler } from "../../messages";
import ClientComponent from "../clientComponent";

export default class Screen extends ClientComponent<any, any> {

    constructor(props: any) {
        super(props);

        this.subscribe(MessageType.Screen, new ScreenHandler(this));
    }

    public componentDidMount() {
        this.client.send(new ScreenMessage({
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
