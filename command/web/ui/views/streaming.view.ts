namespace Web.UI.Views {

    import ScreenEvent = Network.Events.ScreenEvent;
    import ScreenMessage = Network.Messages.ScreenMessage;
    import ScreenMessageParameters = Network.Messages.IScreenMessageParameters;

    /**
     * What kind of thing we are streaming
     */
    export const enum StreamingType {
        MONITOR,
        WINDOW
    }

    export abstract class StreamingView extends SubView {

        protected screenElement;

        private scaleSlider: Slider;
        private fps: HTMLElement;
        private screenEvent: ScreenEvent;

        constructor(private type: StreamingType, template: string, title: string, client: Client) {
            super(template, title, client);

            this.fps = document.createElement("p");
        }

        public onEnter() {
            this.screenElement = super.getElementById("screen") as HTMLImageElement;

            // Setup screen event
            this.screenEvent = new ScreenEvent(this.screenElement, (fps) => {
                // Set FPS label text
                this.fps.innerHTML = fps + " FPS";
            });
            Web.Network.Events.addEvent(Web.Network.Header.Screen, this.screenEvent);

            Statusbar.addElement(this.fps);

            let sliderElement = super.getElementById("scale");
            if (sliderElement) {
                // Initialize slider
                this.scaleSlider = new Slider(sliderElement, {
                    formatter: (value) => {
                        return value + "%";
                    }
                });

                // On slider value change, reinit stream
                this.scaleSlider.on("change", () => {
                    if (this.scaleSlider) {
                        this.initStream();
                    }
                });
            }
        }

        public onLeave() {
            Statusbar.removeElement(this.fps);
            Web.Network.Events.removeEvent(Web.Network.Header.Screen);
            this.screenEvent.stop();
            Web.Network.Socket.send(new ScreenMessage({ active: false } as ScreenMessageParameters), this.client);
        }

        /**
         * Requested scale of image. Defaults to 100% (unchanged)
         */
        protected get scale(): number {
            let value = 100;

            if (this.scaleSlider) {
                value = this.scaleSlider.getValue();
            }

            return value;
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

            Web.Network.Socket.send(new ScreenMessage(params), this.client);
        }
    }
}
