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

        let current = this.client.os.type === "Windows" ? "" : "/"

        return (
            <div style={{padding: 10}}>
                <Navbar>
                    <Nav>
                        <NavItem>Close</NavItem>
                    </Nav>
                </Navbar>

                <Breadcrumb>
                    {depth.filter((part) => part.length > 0).map((part, index) => {
                        const elem = index !== depth.length - 2 ? <a>{part}</a> : part;
                        current += part + this.client.separator;
                        const path = current;

                        return (
                            <li key={part} onClick={() => this.browse(path, true)}>
                                {elem}
                            </li>
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
                            const icon = require("@assets/files/" + this.getFileIcon(file.path, file.directory) + ".png");

                            return (
                                <tr key={file.path} onClick={() => this.browse(file.path)}>
                                    <td>
                                        <img src={icon}/>
                                        {file.path}
                                    </td>
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
        const separator = this.client.separator;

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

        const paths = path.split(separator);
        let depth = "";

        if (separator === "/") {
            paths.splice(0, 1);
            depth = "/";
        }

        this.setState({
            depth: paths
        });

        console.log("browsing", path, this.currentDirectory);

        this.client.send(new BrowseMessage({
            id: this.client.id,
            path: this.currentDirectory
        }));
    }

    private getFileIcon(name: string, isDir?: boolean) {
        if (isDir) {
            return "folder";
        }

        if (name.indexOf(".") !== -1) {
            const ext = name.substring(name.lastIndexOf("."), name.length).toLowerCase();
            let type: string;

            switch (ext) {
                case ".zip":
                case ".tar":
                case ".gz":
                    type = "archive";
                    break;
                case ".js":
                case ".sh":
                case ".bash":
                    type = "script";
                    break;
                case ".bat":
                case ".cmd":
                case ".exe":
                case ".jar":
                    type = "application";
                    break;
                case ".png":
                case ".jpg":
                case ".jpeg":
                case ".gif":
                    type = "image";
                    break;
                default:
                    type = "file";
                    break;
            }

            return type;
        }

        return "file";
    }
}
