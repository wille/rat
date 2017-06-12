type TerminalParameter = string

class TerminalEvent implements IncomingEvent<TerminalParameter> {

	constructor(private view: TerminalView) {

	}

	public emit(data: TerminalParameter) {
		this.view.append(data);
	}
}