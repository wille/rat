/// <reference path="../../network/messages/terminal.message.ts" />

namespace Web.UI.Views {

    import Event = Network.Events;
    import MessageType = Network.Header;
    import TerminalEvent = Network.Events.TerminalEvent;
    import ansi_to_html = ansi.ansi_to_html;
    import TerminalMessage = Network.Messages.TerminalMessage;
    import TerminalAction = Network.Messages.TerminalAction;

    export class TerminalView extends SubView {

        constructor(client: Client) {
            super("terminal.html", "Terminal", client);
        }

        public onEnter() {
            let commandElement = this.getElementById("command") as HTMLInputElement;
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

            Event.addEvent(MessageType.Shell, new TerminalEvent(this));

            this.start();
        }

        public onLeave() {
            Event.removeEvent(MessageType.Shell);

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
            this.terminal.innerHTML += ansi_to_html(line) + "<br>";
        }

        private get terminal() {
            return <HTMLTextAreaElement>this.getElementById("terminal");
        }

        private write(action: TerminalAction, line?: string) {
            Web.Network.Socket.send(new TerminalMessage(action, line), this.client);
        }
    }
}
