import ClientComponent from "@components/clientComponent";
import ScreenHandler from "@messages/screen";
import StreamMessage from "@shared/messages/stream";
import { Monitor } from "@shared/system";
import { MessageType } from "@shared/types";
import * as React from "react";
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from "react-bootstrap";

interface State {
    data: string;
}

export default class Screen extends ClientComponent<{}, State> {

    public state: State = {
        data: null
    };

    private selectedMonitor: Monitor;

    public componentDidMount() {
        this.selectedMonitor = this.client.monitors[0];
        this.subscribe(MessageType.Screen, new ScreenHandler(this));
        this.stream();
    }

    public render() {
        return (
            <div style={{padding: 10}}>
                <Navbar>
                    <Nav>
                        <NavItem>Close</NavItem>
                        <NavDropdown title={"monitor"} id={"dropdown-size-medium"}>
                            {this.client.monitors.map((monitor) => {
                                return (
                                    <MenuItem key={monitor.id} onClick={() => this.selectMonitor(monitor)}>
                                        {monitor.id + ": " + monitor.width + "x" + monitor.height}
                                    </MenuItem>
                                );
                            })}
                        </NavDropdown>
                    </Nav>
                </Navbar>
                <div>
                    <img src={this.state.data}/>
                </div>
            </div>
        );
    }

    private selectMonitor(monitor: Monitor) {
        this.selectedMonitor = monitor;
    }

    private stream() {
        this.client.send(new StreamMessage({
            id: this.client.id,
            active: true,
            scale: 0.5,
            monitor: true,
            handle: this.selectedMonitor.id
        }));
    }
}
