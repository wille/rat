/// <reference path="../../ui/views/view.ts" />

namespace Web.Network.Events {

    import DirectoryView = UI.Views.DirectoryView;
    import Icons = UI.Icons;

    interface FileEntry {
        path: string;
        directory: boolean;
        size: string;
        time: string;
    }

    export class DirectoryEvent implements IncomingEvent<FileEntry[]> {

        constructor(private view: DirectoryView) {
            
        }

        public emit(data: FileEntry[]) {
            this.view.table.innerHTML = "";

            for (let i = 0; i < data.length; i++) {
                let entry = data[i];

                let row = this.view.table.insertRow(i);

                let pathCell = row.insertCell(0);
                pathCell.innerHTML = entry.path;

                if (entry.directory) {
                    pathCell.onclick = () => {
                        this.view.browse(entry.path);
                    };
                }

                pathCell.className = Icons.getFileIcon(entry.path, entry.directory);

                let sizeCell = row.insertCell(1);
                if (entry.size !== "0 B") {
                    sizeCell.innerHTML = entry.size;
                }

                let modCell = row.insertCell(2);
                modCell.innerHTML = entry.time;

                row.onclick = () => {
                    if (row.className === "") {
                        row.className = "selected";
                    } else {
                        row.className = "";
                    }
                };
            }
        }
    }
}
