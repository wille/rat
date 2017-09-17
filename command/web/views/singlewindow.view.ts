class SingleWindowView extends StreamingView {

    constructor(client: Client, private h: number) {
        super(StreamingType.WINDOW, "static/window_stream.html", "Window Stream", client);
    }

    protected get handle() {
        return this.h;
    }

    public onEnter() {
        super.onEnter();

        this.initStream();
    }
}