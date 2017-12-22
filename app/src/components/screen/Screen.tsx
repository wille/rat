import ClientComponent from "@components/clientComponent";
import ScreenHandler from "@messages/screen";
import StreamMessage from "@shared/messages/stream";
import { Monitor } from "@shared/system";
import { MessageType } from "@shared/types";
import * as React from "react";
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from "react-bootstrap";
import Stream from "@components/screen/Stream";

interface State {
    data: string;
    scale: number;
}

export default class Screen extends ClientComponent<{}, State> {

    public state: State = {
        data: null,
        scale: 0.5
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
                        <NavItem>
                            <input
                                type="range"
                                min={1}
                                max={100}
                                onChange={(e) => this.setScale(e.target.valueAsNumber)}
                            />
                        </NavItem>
                    </Nav>
                </Navbar>
                <div>
                    <Stream client={this.client} mouse keyboard image={this.state.data}/>
                </div>
            </div>
        );
    }

    private setScale(scale: number) {
        this.setState({
            scale: scale / 100
        });
        this.stream();
    }

    private selectMonitor(monitor: Monitor) {
        this.selectedMonitor = monitor;
    }

    private stream() {
        const { scale } = this.state;

        this.client.send(new StreamMessage({
            _id: this.client.id,
            active: true,
            scale,
            monitor: true,
            handle: this.selectedMonitor.id
        }));
    }
}
