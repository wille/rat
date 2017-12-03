import * as React from "react";

export default abstract class TabPage {

    public readonly id = Math.random();

    constructor(public title: string) {

    }

    public abstract render(): React.ReactNode;
}
