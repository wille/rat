namespace Web.Network.Events {

    import WindowView = UI.Views.WindowView;
    import Monitor = Desktop.Monitor;
    import Frame = Desktop.Frame;

    interface WindowsParameters {
        monitors: Monitor[];
        frames: Frame[];
    }

    export class WindowsIncomingMessage implements IncomingEvent<WindowsParameters> {

        constructor(private view: WindowView) {

        }

        public emit(data: WindowsParameters) {
            this.view.addFrame(data.frames);
            this.view.addMonitors(data.monitors);
        }
    }
}
