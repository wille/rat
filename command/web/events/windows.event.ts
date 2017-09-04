interface WindowsParameters {
    monitors: Monitor[];
    frames: Frame[];
}

class WindowsIncomingMessage implements IncomingEvent<WindowsParameters> {

    constructor(private view: WindowView) {

    }

	public emit(data: WindowsParameters) {
        console.log(data);
    }
}