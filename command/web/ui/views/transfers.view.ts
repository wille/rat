/// <reference path="view.ts" />

namespace Web.UI.Views {

    export class TransfersView extends SubView {

        private element: HTMLTableElement;
        private interval: number;

        constructor() {
            super("transfers.html", "Transfers");
        }

        public onEnter() {
            this.element = <HTMLTableElement>document.getElementById("transfers");

            this.update();

            this.interval = setInterval(() => {
                this.update();
            }, 1000);
        }

        public onLeave() {
            clearInterval(this.interval);
        }

        private update() {
            this.element.innerHTML = "";

            for (let t of Transfers.getTransfers()) {
                this.addTransfer(t);
            }
        }

        private addTransfer(transfer: Transfer) {
            let row = this.element.insertRow(0);

            let statusCell = row.insertCell(0);
            let str;

            switch (transfer.status) {
                case Transfers.Status.COMPLETE:
                    str = "Complete";
                    break;
                case Transfers.Status.IN_PROGRESS:
                    if (transfer.download) {
                        str = "Downloading...";
                    } else {
                        str = "Uploading...";
                    }
                    break;
                case Transfers.Status.FAIL:
                    str = "Error";
                    break;
                default:
                    str = transfer.status;
                    break;
            }
            statusCell.innerHTML = str;

            let localCell = row.insertCell(1);
            localCell.innerHTML = transfer.local !== undefined ? transfer.local : "";

            let remoteCell = row.insertCell(2);
            remoteCell.innerHTML = transfer.remote !== undefined ? transfer.remote : "";

            let progressCell = row.insertCell(3);
            progressCell.innerHTML = '<progress value=' + transfer.progress + ' min=0 max=100></progress>';

            let saveCell = row.insertCell(4);
            if (transfer.key !== undefined) {
                saveCell.innerHTML = '<a href="/download?key=' + transfer.key + '">Save</a>';
            }
        }
    }
}
