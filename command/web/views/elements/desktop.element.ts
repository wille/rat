/// <reference path="elementWrapper.ts" />

class DesktopElement extends ElementWrapper<HTMLCanvasElement, "canvas"> {

    private monitors: Monitor[];
    private frames: Frame[];

    private ratio: number;
    private offsetY;
    private offsetX;

    public frameClick: (frame: Frame) => void;

    constructor() {
        super("canvas");
        this.backing.onclick = (event: MouseEvent) => this.onclick(event);
    }

    public setMonitors(monitors: Monitor[]) {
        this.monitors = monitors;
        this.calculate();
    }

    public setFrames(frames: Frame[]) {
        this.frames = frames;
    }

    private render() {
        const graphics = this.backing.getContext("2d");
        const ratio = this.ratio;

        graphics.fillStyle = "#ffffff";
        graphics.fillRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.frames.length; i++) {
            let window = this.frames[i];

            if (!window.title || window.title.length == 0) {
                continue;
            }

            if (window.rect.w === 0 || window.rect.h === 0) {
                continue;
            }

            let rx = (window.rect.x + this.offsetX) * ratio;
            let ry = (window.rect.y + this.offsetY) * ratio;
            let rw = window.rect.w * ratio;
            let rh = window.rect.h * ratio;

            graphics.fillStyle = this.getRandomColor();
            graphics.fillRect(rx, ry, rw, rh);
        }
    }

    private onclick(event: MouseEvent) {
        const ratio = this.ratio;
        
        for (let i = this.frames.length - 1; i >= 0; i--) {
            let window = this.frames[i];

            if (!window.title || window.title.length == 0) {
                continue;
            }

            if (window.rect.w === 0 || window.rect.h === 0) {
                continue;
            }

            let rx = (window.rect.x + this.offsetX) * ratio;
            let ry = (window.rect.y + this.offsetY) * ratio;
            let rw = window.rect.w * ratio;
            let rh = window.rect.h * ratio;

            if (event.offsetX >= rx && event.offsetX <= rw && event.offsetY >= ry && event.offsetY <= rh) {
                if (this.frameClick) {
                    this.frameClick(window);
                }
                break;
            }
        }
    }

    private getRandomColor() {
        let hex = "0123456789abcdef";
        let color = "#";
        for (var i = 0; i < 6; i++) {
            color += hex[Math.floor(Math.random() * 16)];
        }

        return color;
    }

    private calculate() {
        let totalWidth = 0;
        let totalHeight = 0;

        let xs = [];
        let ys = [];

        let minX = 0;
        let minY = 0;

        for (let monitor of this.monitors) {
            if (!ys[monitor.y]) {
                ys[monitor.y] = true;
                totalHeight += Math.abs(monitor.height);
            }

            if (!xs[monitor.x]) {
                xs[monitor.x] = true;
                totalWidth += Math.abs(monitor.width);
            }

            if (monitor.x < minX) {
                minX = monitor.x;
            }

            if (monitor.y < minY) {
                minY = monitor.y;
            }
        }

        this.offsetX = Math.abs(minX);
        this.offsetY = Math.abs(minY);

        const maxWidth = 600;
        const maxHeight = 400;
        
        let ratio = Math.min(maxWidth / totalWidth, maxHeight / totalHeight);

        this.width = totalWidth * ratio;
        this.height = totalHeight * ratio;

        this.ratio = ratio;

        this.render();
    }

    private get width() {
        return this.backing.width;
    }

    private set width(w: number) {
        this.backing.width = w;
    }

    private get height() {
        return this.backing.height;
    }

    private set height(h: number) {
        this.backing.height = h;
    }
}