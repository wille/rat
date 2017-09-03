class WindowView extends SubView {

    constructor(client: Client) {
        super("static/window.html", "Window List", client);
    }

    private clear() {
        this.table.innerHTML = "";
    }

    private reload() {
        this.clear();
        Control.instance.send(new WindowsOutgoingMessage(this), this.client);
    }

    public onEnter() {
        Control.addEvent(Control.MessageType.WINDOWS, new WindowsIncomingMessage(this));
        
        let searchElement = this.getElementById("search") as HTMLInputElement;
		new TableSearch(searchElement, this.table);

        this.reload();
    }

    public onLeave() {

    }

    public addFrame(window: Frame) {
        let row: HTMLTableRowElement;
        let title;

        if (window.title) {
            row = this.table.insertRow(0);
            title = window.title;
        } else {
            row = this.table.insertRow();
            title = "Undefined";
            row.className = "undefined";
        }

        row.insertCell().innerText = title;        
    }

    public get table(): HTMLTableElement {
		return this.getElementById("windows") as HTMLTableElement;
	}
}