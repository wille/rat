class WindowContextMenu extends ContextMenu {

    private view: WindowView;

    private downloadItem;
    private deleteItem;

    constructor(parent: WindowView) {
        super(parent.table, parent.getElementById("menu"));

        this.view = parent;

        this.downloadItem = parent.getElementById("item-open");
        this.downloadItem.onclick = () => parent.show();

        this.deleteItem = document.getElementById("item-minimize");
        this.deleteItem.onclick = () => parent.minimize();
    }
}

class WindowView extends SubView {

    private desktop: DesktopElement;
    private frames: Frame[];

    constructor(client: Client) {
        super("static/window.html", "Window List", client);

        this.desktop = new DesktopElement(client);
    }

    private clear() {
        this.table.innerHTML = "";
    }

    private reload() {
        this.clear();
        Control.instance.send(new WindowsOutgoingMessage(), this.client);
    }

    public onEnter() {
        Control.addEvent(Control.MessageType.WINDOWS, new WindowsIncomingMessage(this));

        let searchElement = this.getElementById("search") as HTMLInputElement;
        new TableSearch(searchElement, this.table);

        let desktopDiv = this.getElementById("desktop");
        desktopDiv.appendChild(this.desktop.element);
        this.desktop.frameClick = (frame: Frame) => this.onclick(frame);

        let reloadElement = this.getElementById("reload");
        reloadElement.onclick = () => this.reload();

        let menu = new WindowContextMenu(this);
        menu.hook();

        this.reload();
    }

    public onLeave() {

    }

    public addMonitors(monitors: Monitor[]) {
        this.desktop.setMonitors(monitors);
    }

    public addFrame(frames: Frame[]) {
        for (let window of frames) {
            let row: HTMLTableRowElement;
            let title;

            if (window.title && window.title.length > 0) {
                row = this.table.insertRow(0);
                title = window.title;
            } else {
                row = this.table.insertRow();
                title = "Undefined";
                row.className = "undefined";
            }

            row.insertCell().innerText = title;
            row.insertCell().innerText = window.handle + "";

            row.onclick = () => {
                if (row.className.indexOf("selected") === -1) {
                    row.className += " selected";
                } else {
                    row.className = row.className.replace(" selected", "");
                }
            }
        }

        this.desktop.setFrames(frames);
        this.frames = frames;
    }

    // A frame is clicked in the desktop element
    private onclick(frame: Frame) {
        let rows = this.table.rows;

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];

            if (row.cells[0].innerText === frame.title) {
                row.className += "selected";
                row.scrollIntoView(true);
            } else {
                row.className = row.className.replace(" selected", "");
            }
        }
    }

    private getSelectedFrames(): Frame[] {
        let rows = this.table.rows;

        let frames: Frame[] = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];

            if (row.className.indexOf("selected") !== -1) {
                let title = row.cells[0].innerText;
                let handle = row.cells[1].innerText;

                for (let frame of this.frames) {
                    if (frame.title === title && String(frame.handle) === handle) {
                        frames.push(frame);
                    }
                }
            }
        }

        return frames;
    }

    public show() {
        this.getSelectedFrames().forEach(element => {
            console.log("Show", element.title);
        });
    }

    public minimize() {
        this.getSelectedFrames().forEach(element => {
            console.log("Minimizing", element.title);
        });
    }

    public get table(): HTMLTableElement {
        return this.getElementById("windows") as HTMLTableElement;
    }
}