/// <reference path="../../ui/views/view.ts" />

namespace Web.Network.Events {

    interface ProcessParameters {
        pid: number;
        path: string;
    }
    
    export class ProcessEvent implements IncomingEvent<ProcessParameters> {
    
        constructor(private table: HTMLTableElement) { }
    
        public emit(data: ProcessParameters) {
            let row = this.table.insertRow(0);
    
            let pidCell = row.insertCell(0);
            pidCell.innerHTML = String(data.pid);
    
            let pathCell = row.insertCell(1);
            pathCell.innerHTML = data.path;
    
            row.onclick = () => {
                if (row.className === "") {
                    row.className = "selected";
                } else {
                    row.className = "";
                }
            }
        }
    }
}
