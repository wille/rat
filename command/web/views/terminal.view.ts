enum Shell {
	START = 0,
	STOP = 1,
	WRITE = 2
}

class TerminalView extends SubView {

	constructor(id: number) {
		super("static/terminal.html", "Terminal", id);
	}

	public static open(id: number) {
		sub.setView(new TerminalView(id));
	}

	onEnter() {
		let commandElement = <HTMLInputElement>this.getElementById("command");
		commandElement.onkeypress = (event) => {
			if (event.keyCode === 13) { // enter
				this.sendCommand();
			}
		};

		let runElement = this.getElementById("run");
		runElement.onclick = () => {
			this.sendCommand();
		};

		let clearElement = this.getElementById("clear");
		clearElement.onclick = () => {
			this.terminal.innerHTML = "";
		};
	
		Control.addEvent(Control.EventType.TERMINAL, new TerminalEvent(this));

		this.write(Shell.START);
	}

	onLeave() {
		Control.removeEvent(Control.EventType.TERMINAL);

		this.write(Shell.STOP);
	}

	private sendCommand() {
		let commandElement = <HTMLInputElement>this.getElementById("command");

		let command = commandElement.value;
		this.append("> " + command);
		this.write(Shell.WRITE, command);
		commandElement.value = "";
	}

	// Append a raw line to the terminal element
	public append(line: string) {
		line = line.replace("\t", "   ");
		this.terminal.innerHTML += ANSI.ansi_to_html(line) + "<br>";
	}

	private get terminal() {
		return <HTMLTextAreaElement>this.getElementById("terminal");
	}

	private write(action: number, line: string = "") {
		let data = JSON.stringify({
			"action": action,
			"command": line
		});

		Control.instance.write(Control.EventType.TERMINAL, data, this.id);
	}
}
