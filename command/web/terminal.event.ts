class TerminalEvent implements Control.IncomingEvent {

	constructor(private view: TerminalView) {

	}

	public emit(data) {
		this.view.append(data);
	}
}