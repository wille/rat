const enum StreamingType {
    MONITOR,
    WINDOW
}

abstract class StreamingView extends SubView {

    private fps: HTMLElement;
    private screenEvent: ScreenEvent;
    
    protected screenElement;    

    constructor(private type: StreamingType, template: string, title: string, client: Client) {
		super(template, title, client);

		this.fps = document.createElement("p");
    }
    
    public onEnter() {
        this.screenElement = <HTMLImageElement>super.getElementById("screen");
        
		// Setup screen event
		this.screenEvent = new ScreenEvent(this.screenElement, (fps) => {
			// Set FPS label text
			this.fps.innerHTML = fps + " FPS";
		});
		Control.addEvent(Control.MessageType.SCREEN, this.screenEvent);

		Statusbar.addElement(this.fps);
    }

    public onLeave() {
        Statusbar.removeElement(this.fps);
        Control.removeEvent(Control.MessageType.SCREEN);
        this.screenEvent.stop();
        Control.instance.send(new ScreenMessage({ active: false } as ScreenMessageParameters), this.client);        
    }

    /**
     * Requested scale of image. Defaults to 100% (unchanged)
     */
    protected get scale(): number {
        return 100;
    }

    /**
     * The handle to identify what to stream (monitor id, window handle...)
     */
    protected abstract get handle(): number;
    
	// Sends screen event with new configuration
	public initStream() {
		let params: ScreenMessageParameters = {
			active: true,
			scale: this.scale / 100,
			monitor: this.type === StreamingType.MONITOR,
			handle: this.handle
		};

		Control.instance.send(new ScreenMessage(params), this.client);
	}
}