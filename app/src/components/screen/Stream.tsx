import * as React from "react";
import { InputState, MouseButton } from "@shared/display";

interface Props {
    mouse: boolean;
    keyboard: boolean;
}

interface State {
    image: string;
}

type MouseEvent = React.MouseEvent<HTMLImageElement>;

export default class Stream extends React.Component<Props, State> {

    public render() {
        const { image } = this.state;

        return (
            <img
                src={image}
                onMouseDown={(e) => this.onMouseDown(e)}
                onMouseUp={(e) => this.onMouseUp(e)}
                onMouseMove={(e) => this.onMouseMove(e)}
            />
        );
    }

    private get mouse() {
        return this.props.mouse;
    }

    private get keyboard() {
        return this.props.keyboard;
    }

    private onMouseDown(event: MouseEvent) {
        if (this.mouse) {

        }
    }

    private onMouseUp(event: MouseEvent) {
        if (this.mouse) {

        }
    }

    private onMouseMove(event: MouseEvent) {
        if (this.mouse) {

        }
    }

    private keyEvent(event: any) {
        if (this.keyboard) {

        }
    }
}
