/// <reference path="../messages/terminal.message.ts" />

class TerminalView extends SubView {

	constructor(client: Client) {
		super("static/terminal.html", "Terminal", client);
	}

	public static open(id: number) {
		sub.setView(new TerminalView(new Client(id)));
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

		this.start();
	}

	onLeave() {
		Control.removeEvent(Control.EventType.TERMINAL);

		this.stop();
	}

	private start() {
		this.write(TerminalAction.START);
	}

	public stop() {
		this.write(TerminalAction.STOP);
	}

	private sendCommand() {
		let commandElement = <HTMLInputElement>this.getElementById("command");

		let command = commandElement.value;
		this.append("> " + command);
		this.write(TerminalAction.WRITE, command);
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

	private write(action: TerminalAction, line?: string) {
		Control.instance.write(new TerminalMessage(action, line), this.client);
	}
}
