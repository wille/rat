interface WindowsParameters {
	frames: Frame[];
}

class WindowsIncomingMessage implements IncomingMessage<WindowsParameters> {

    constructor(private view: WindowView) {

    }

	public emit(data: WindowsParameters) {
        console.log(data);
    }

}