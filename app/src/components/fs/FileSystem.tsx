import ClientComponent from "@components/clientComponent";
import DirectoryContentHandler from "@messages/directory";
import BrowseMessage from "@shared/messages/browse";
import { MessageType } from "@shared/types";
import { FileEntry } from "@templates/directory";
import * as React from "react";
import { Breadcrumb, Nav, Navbar, NavItem, Table } from "react-bootstrap";

interface State {
    files: FileEntry[];
    depth: string[];
}

export default class FileSystem extends ClientComponent<{}, State> {

    public state: State = {
        files: [],
        depth: []
    };

    private currentDirectory: string;

    public componentDidMount() {
        this.subscribe(MessageType.Directory, new DirectoryContentHandler(this));
        this.browse("");
    }

    public render() {
        const { files, depth } = this.state;

        return (
            <div style={{padding: 10}}>
                <Navbar>
                    <Nav>
                        <NavItem>Close</NavItem>
                    </Nav>
                </Navbar>

                <Breadcrumb>
                    {depth.map((part) => {
                        return (
                            <Breadcrumb.Item key={part}>
                                {part}
                            </Breadcrumb.Item>
                        );
                    })}
                </Breadcrumb>

                <Table bordered>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Last modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => {
                            const size = file.directory ? "" : file.size;

                            return (
                                <tr key={file.path} onClick={() => this.browse(file.path)}>
                                    <td>{file.path}</td>
                                    <td>{size}</td>
                                    <td>{file.time}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }

    private navigate(item: any) {
        console.log(item.target);
    }

    private browse(path: string, absolute: boolean = false) {
        const separator = "/";

        if (!this.currentDirectory) {
            this.currentDirectory = separator === "/" ? "/" : "";
        }

        if (path !== "") {
            if (absolute) {
                this.currentDirectory = path;
            } else {
                path = this.currentDirectory + path + separator;
                this.currentDirectory = path;
            }
        }

        let paths = path.split(separator);
        let depth = "";

        if (separator === "/") {
            paths.splice(0, 1);
            depth = "/";
        }

        this.setState({
            depth: paths
        });

        this.client.send(new BrowseMessage({
            id: this.client.id,
            path: this.currentDirectory
        }));
    }
}
