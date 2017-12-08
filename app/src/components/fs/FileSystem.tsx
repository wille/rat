import * as React from "react";
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from "react-bootstrap";

import StreamMessage from "../../../../shared/src/messages/stream";
import { Monitor } from "../../../../shared/src/system";
import { MessageType } from "../../../../shared/src/types";
import { ScreenHandler } from "../../messages";
import ClientComponent from "../clientComponent";

interface State {
    data: string;
}

export default class FileSystem extends ClientComponent<{}, State> {

    public state: State = {
        data: null
    };

    public componentDidMount() {

    }

    public render() {
        return (
            <div/>
        );
    }
}
