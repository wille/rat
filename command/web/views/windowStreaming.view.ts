class SingleWindowView extends StreamingView {

    private selectedFrame: Frame;

    constructor(client: Client, private frames: Frame[], preferred?: Frame) {
        super(StreamingType.WINDOW, "static/window_stream.html", "Window Stream", client);

        this.selectedFrame = preferred;
    }

    protected get handle() {
        return this.selectedFrame.handle;
    }

    private get windowsElement() {
        return super.getElementById("windows");
    }

    public onEnter() {
        super.onEnter();
        super.initStream();

        let element = this.windowsElement;

        // Remove all menu items from dropdown
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        for (let frame of this.frames) {
            let str = frame.title + " (" + frame.rect.w + "x" + frame.rect.h + ")";

            let child = document.createElement("li");
            let a = document.createElement("a");
            child.appendChild(a);

            a.innerText = str;
            child.onclick = () => {
                this.selectedFrame = frame;
                this.initStream();
            };

            // If this window is selected, disable the menu item
            if (this.selectedFrame == frame) {
                child.className = "disabled";
            }

            element.appendChild(child);
        }
    }
}