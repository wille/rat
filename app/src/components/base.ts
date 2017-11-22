import * as React from "react";

abstract class ClientComponent<P, S> extends React.Component<P, S> {

    constructor(props: P) {
        super(props);
    }

    public abstract render(): React.ReactNode;
}
