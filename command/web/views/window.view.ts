class WindowView extends SubView {

    constructor(client: Client) {
        super("static/window.html", "Window List", client);
    }

    private reload() {
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

    public get table(): HTMLTableElement {
		return this.getElementById("windows") as HTMLTableElement;
	}
}