type WindowsParameters = Frame[];

class WindowsIncomingMessage implements IncomingEvent<WindowsParameters> {

    constructor(private view: WindowView) {

    }

	public emit(data: WindowsParameters) {
        for (let frame of data) {
            this.view.addFrame(frame);
        }
    }
}