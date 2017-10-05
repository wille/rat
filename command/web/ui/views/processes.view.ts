namespace Web.UI.Views {

    import Event = Network.Events;
    import Socket = Network.Socket;
    import MessageType = Network.Header;
    import showDialog = Dialogs.showDialog;
    import SpawnDialog = Dialogs.SpawnDialog;
    import ProcessEvent = Network.Events.ProcessEvent;
    import ProcessRequestType = Network.Messages.ProcessRequestType;
    import ProcessMessage = Network.Messages.ProcessMessage;
    import ProcessMessageParameters = Network.Messages.ProcessMessageParameters;

    export class ProcessView extends SubView {

        private table: HTMLTableElement;

        constructor(client: Client) {
            super("processes.html", "Processes", client);
        }

        public onEnter() {
            this.table = <HTMLTableElement>this.getElementById("processes");

            Event.addEvent(MessageType.Process, new ProcessEvent(this.table));
            this.update();

            let killElement = this.getElementById("kill");
            killElement.onclick = () => this.kill();

            let spawnElement = this.getElementById("spawn");
            spawnElement.onclick = () => this.spawn();

            let searchElement = <HTMLInputElement>this.getElementById("search");
            new TableSearch(searchElement, this.table);
        }

        public onLeave() {
            Event.removeEvent(MessageType.Process);
        }

        public getSelectedProcesses() {
            let elements = document.getElementsByTagName("tr");

            let selected = [];

            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];

                if (element.className === "selected" && !element.hidden) {
                    selected.push(Number(element.children[0].innerHTML));
                }
            }

            return selected;
        }

        private send(type: ProcessRequestType, pids?: number[]) {
            let params: ProcessMessageParameters = {
                type: type
            };

            if (pids) {
                params.pids = pids;
            }

            Socket.send(new ProcessMessage(params), this.client);
        }

        private update() {
            this.send(ProcessRequestType.QUERY)
        }

        private kill() {
            this.send(ProcessRequestType.KILL, this.getSelectedProcesses());
        }

        private spawn() {
            showDialog(new SpawnDialog(this.client));
        }
    }
}
