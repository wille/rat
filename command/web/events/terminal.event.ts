class TerminalEvent implements Control.IncomingEvent {

	constructor(private view: TerminalView) {

	}

	public emit(data) {
		console.log(data);
		this.view.append(data);
	}
}