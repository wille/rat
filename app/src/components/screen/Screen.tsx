import * as React from "react";
import { ButtonGroup, DropdownToggle, MenuItem } from "react-bootstrap";

import StreamMessage from "../../../../shared/src/messages/stream";
import { Monitor } from "../../../../shared/src/system";
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
            <div>
                <ButtonGroup>
                    <DropdownToggle>
                        {this.client.monitors.map((monitor) => {
                            return (
                                <MenuItem key={monitor.id} onClick={() => this.selectMonitor(monitor)}>
                                    {monitor.id + ": " + monitor.width + "x" + monitor.height}
                                </MenuItem>
                            );
                        })}
                    </DropdownToggle>
                </ButtonGroup>
                <img src={this.state.data}/>
            </div>
        );
    }

    private selectMonitor(monitor: Monitor) {

    }
}
