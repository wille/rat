/// <reference path="component.ts" />

class DesktopComponent extends Component<"canvas"> {

    private monitors: Monitor[];
    private frames: Frame[];

    private ratio: number;
    private offsetY;
    private offsetX;

    public frameClick: (frame: Frame) => void;

    /**
     * A client is needed to remove some OS specific windows like "Program Manager" on Windows
     * @param client
     */
    constructor(private client: Client) {
        super("canvas");
        this.backing.onclick = (event: MouseEvent) => this.onclick(event);
    }

    public setMonitors(monitors: Monitor[]) {
        this.monitors = monitors;
        this.calculate();
    }

    /**
     * Set the frames this desktop element should display
     * @param frames
     */
    public setFrames(allFrames: Frame[]) {
        let frames = [];

        for (let frame of allFrames) {
            if (frame.visible && frame.rect.w > 0 && frame.rect.h > 0) {
                frames.push(frame);
            }
        }

        this.frames = frames;
    }

    /**
     * Returns the position and dimensions of this frame, scaled to desktop element
     * @param frame 
     */
    private getScaledDimensions(frame: Frame): Rect {
        const ratio = this.ratio;

        return {
            x: (frame.rect.x + this.offsetX) * ratio,
            y: (frame.rect.y + this.offsetY) * ratio,
            w: frame.rect.w * ratio,
            h: frame.rect.h * ratio
        }
    }

    /**
     * Renders all visible frames with a title
     */
    private render() {
        const graphics = this.backing.getContext("2d");
        const ratio = this.ratio;

        graphics.fillStyle = "#ffffff";
        graphics.fillRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.frames.length; i++) {
            let frame = this.frames[i];

            graphics.fillStyle = this.getRandomColor();

            let dimension = this.getScaledDimensions(frame);
            graphics.fillRect(dimension.x, dimension.y, dimension.w, dimension.h);
        }
    }

    /**
     * When this element is clicked, find the topmost frame that was clicked
     * @param event 
     */
    private onclick(event: MouseEvent) {
        const ratio = this.ratio;
        
        for (let i = this.frames.length - 1; i >= 0; i--) {
            let frame = this.frames[i];
            
            let dimensions = this.getScaledDimensions(frame);

            if (event.offsetX >= dimensions.x && event.offsetX <= dimensions.x + dimensions.w &&
                event.offsetY >= dimensions.y && event.offsetY <= dimensions.y + dimensions.h) {              
                if (this.frameClick) {
                    this.frameClick(frame);
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