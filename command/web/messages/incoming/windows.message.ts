interface WindowsParameters {
	frames: Frame[];
}

class WindowsIncomingMessage implements IncomingMessage<WindowsParameters> {

    constructor(private view: WindowView) {

    }

	public emit(data: WindowsParameters) {
        for (let frame of data.frames) {
            this.view.addFrame(frame);
        }
    }
}