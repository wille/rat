/// <reference path="view.ts" />
/// <reference path="../containers/containers.ts" />
/// <reference path="../contextmenu.ts" />

namespace Web.UI.Views {

    export const enum TableCell {
        COUNTRY,
        HOST,
        COMPUTER,
        OS,
        PING
    }

    /**
     * Cells that allows changes
     */
    type DynamicCell = TableCell.PING;

    class ClientContextMenu extends ContextMenu {

        private viewItem: HTMLElement;
        private viewScreenItem: HTMLElement;
        private viewFilesItem: HTMLElement;
        private viewProcessesItem: HTMLElement;
        private viewWindowsItem: HTMLElement;

        private systemItem: HTMLElement;
        private systemShutdownItem: HTMLElement;
        private systemRebootItem: HTMLElement;

        private disconnectItem: HTMLElement;

        constructor(private view: ClientsView, tableBody: HTMLTableSectionElement) {
            super(tableBody, view.getElementById("menu"));

            this.viewItem = view.getElementById("item-view");
            ContextMenu.createSubMenu(this.viewItem);

            this.viewScreenItem = view.getElementById("item-view-screen");
            this.viewScreenItem.onclick = () => this.onViewScreen();

            this.viewFilesItem = view.getElementById("item-view-files");
            this.viewFilesItem.onclick = () => this.onViewFiles();

            this.viewProcessesItem = view.getElementById("item-view-processes");
            this.viewProcessesItem.onclick = () => this.onViewProcesses();

            this.systemItem = view.getElementById("item-system");
            ContextMenu.createSubMenu(this.systemItem);

            this.systemShutdownItem = view.getElementById("item-system-shutdown");
            this.systemShutdownItem.onclick = () => this.onShutdown();

            this.systemRebootItem = view.getElementById("item-system-reboot");
            this.systemRebootItem.onclick = () => this.onReboot();

            this.disconnectItem = view.getElementById("item-disconnect");
            this.disconnectItem.onclick = () => this.onDisconnect();

            this.viewWindowsItem = view.getElementById("item-view-windows");
            this.viewWindowsItem.onclick = () => this.onViewWindows();
        }

        public onOpen() {
            let selected = this.view.getSelectedClients();

            let className = "";

            if (selected.length === 0) {
                className = "disabled";
            }

            this.disconnectItem.className = className;
            this.systemShutdownItem.className = className;
            this.systemRebootItem.className = className;
        }

        public onClose() {

        }

        private forEach(func: (client: Client) => boolean) {
            for (let client of this.view.getSelectedClients()) {
                if (!func(client)) {
                    return;
                }
            }
        }

        private onViewScreen() {
            this.forEach((client) => {
                Containers.setSubView(new ScreenView(client));
                return true;
            });
        }

        private onViewFiles() {
            this.forEach((client) => {
                Containers.setSubView(new DirectoryView(client));
                return true;
            });
        }

        private onViewProcesses() {
            this.forEach((client) => {
                Containers.setSubView(new ProcessView(client));
                return true;
            });
        }

        private onViewWindows() {
            this.forEach((client) => {
                Containers.setSubView(new WindowView(client));
                return true;
            });
        }

        private onDisconnect() {
            if (confirm("Disconnect")) {
                this.forEach((client) => {
                    client.disconnect();
                    return true;
                });
            }
        }

        private onShutdown() {
            if (confirm("Shutdown")) {
                this.forEach((client) => {
                    client.shutdown();
                    return true;
                });
            }
        }

        private onReboot() {
            if (confirm("Reboot")) {
                this.forEach((client) => {
                    client.reboot();
                    return true;
                });
            }
        }
    }

    export class ClientsView extends MainView {

        private tableBody: HTMLTableSectionElement;

        rows: HTMLTableRowElement[] = [];

        constructor() {
            super("clients.html", "Clients");
        }

        public onEnter() {
            this.tableBody = <HTMLTableSectionElement>super.getElementById("body");

            let contextMenu = new ClientContextMenu(this, this.tableBody);
            contextMenu.hook();
        }

        public onLeave() {

        }

        /**
         * Returns specific cell element for a client
         * @param client 
         * @param cell 
         */
        private getCellElement(client: Client, cell: TableCell): HTMLElement {
            let row = this.rows[client.id];

            if (row) {
                return row.cells.item(cell);
            }

            return undefined;
        }

        public getSelectedClients(): Client[] {
            let clients = [];

            for (let id in this.rows) {
                let row = this.rows[id];
                if (row.className === "selected") {
                    clients.push(Client.getById(Number(id)));
                }
            }

            return clients;
        }

        /**
         * Update table cell value
         * @param client 
         * @param cell Which cell to update
         * @param value Value to change to
         */
        public setCell(client: Client, cell: DynamicCell, value: any) {
            switch (cell) {
                case TableCell.PING:
                    let element = this.getCellElement(client, cell);
                    element.innerText = " " + value;
                    element.className = "ping " + Icons.getPingClass(client.ping);
                    break;
                default:
                    console.error("cannot update readonly value", cell);
                    break;
            }
        }

        /**
         * Add client to table, create row and cells, add default readonly values
         * @param client 
         */
        public add(client: Client) {
            let row = this.tableBody.insertRow();
            this.rows[client.id] = row;

            row.onclick = () => {
                if (row.className === "") {
                    row.className = "selected";
                } else {
                    row.className = "";
                }
            };

            let countryCell = row.insertCell(TableCell.COUNTRY);

            let flagElement = document.createElement("img");
            flagElement.src = "static/images/flags/" + client.flag + ".png";
            countryCell.appendChild(flagElement);

            let countryTextElement = document.createElement("span");
            countryTextElement.innerText = client.country;
            countryCell.appendChild(countryTextElement);

            let hostCell = row.insertCell(TableCell.HOST);
            hostCell.innerHTML = client.host;

            let computerCell = row.insertCell(TableCell.COMPUTER);
            computerCell.innerHTML = client.computerName;

            let osCell = row.insertCell(TableCell.OS);

            let osIconElement = document.createElement("img");
            osIconElement.src = Icons.getOperatingSystemIcon(client.operatingSystem.display);
            osCell.appendChild(osIconElement);

            let osTextElement = document.createElement("span");
            osTextElement.innerText = " " + client.operatingSystem.display;
            osCell.appendChild(osTextElement);

            let pingCell = row.insertCell(TableCell.PING);
            this.setCell(client, TableCell.PING, 0);
        }

        /**
         * Remove client from table
         * @param client
         */
        public remove(client: Client) {
            this.tableBody.removeChild(this.rows[client.id]);
            delete this.rows[client.id];
        }
    }
}
