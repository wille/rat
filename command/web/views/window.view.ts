class WindowView extends SubView {

    private desktop = new DesktopElement();

    constructor(client: Client) {
        super("static/window.html", "Window List", client);
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
        
        let desktopDiv = document.getElementById("desktop");
        desktopDiv.appendChild(this.desktop.element);

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
        }
        this.desktop.setFrames(frames);
    }

    public get table(): HTMLTableElement {
		return this.getElementById("windows") as HTMLTableElement;
	}
}