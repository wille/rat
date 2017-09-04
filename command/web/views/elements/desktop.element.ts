/// <reference path="elementWrapper.ts" />

class DesktopElement extends ElementWrapper<HTMLCanvasElement, "canvas"> {

    private frames: Frame[];

    constructor() {
        super("canvas");
    }

    public setMonitors(monitors: Monitor) {

    }

    public setFrames(frames: Frame[]) {
        this.frames = frames;
    }

    private render() {
        const graphics = this.backing.getContext("2d");
    }

    private calculateTotalWidth() {

    }
}