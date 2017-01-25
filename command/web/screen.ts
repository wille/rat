class ScreenStream {

	private socket: WebSocket;

	constructor(private id: number, private screen: HTMLImageElement) { }

	public start() {
		this.socket = new WebSocket("wss://localhost:7777/ssock");
		this.socket.onmessage = (event) => this.onMessage(event);
		this.socket.onopen = () => this.onOpen();
	}

	private onMessage(event) {
		this.screen.src = "data:image/jpg;base64," + event.data;
	}

	private onOpen() {
		this.socket.send(this.id + "\n");
	}
}