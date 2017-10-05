namespace Web.Network.Events {

    type ScreenParameter = string

    export class ScreenEvent implements IncomingEvent<ScreenParameter> {

        private fps = 0;
        private interval: number;

        /**
         * @param element will get the image
         * @param callback called each second when FPS is updated
         */
        constructor(private element: HTMLImageElement, private callback: (fps: number) => void) {
            // Report current FPS once a second
            this.interval = setInterval(() => {
                callback(this.fps);
                this.fps = 0;
            }, 1000);
        }

        public emit(data: ScreenParameter) {
            this.element.src = "data:image/jpg;base64," + data;
            this.fps++;
        }

        // Stop the FPS reporter interval
        public stop() {
            clearInterval(this.interval);
        }
    }
}
