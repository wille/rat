import ClientComponent from "@components/clientComponent";
import * as React from "react";

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
