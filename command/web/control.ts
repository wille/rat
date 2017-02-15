namespace Control {

	let events: IncomingEvent[] = [];

	export enum EventType {
		SCREEN = 0, // screen.event.ts
		PROCESS = 1, // process.event.ts
		MONITOR = 2, // monitor.event.ts
		DIRECTORY = 3, // directory.event.ts
		DOWNLOAD = 4, // download.event.ts
		TRANSFERS = 5,
		DOWNLOAD_PROGRESS = 6,
		MOUSE_MOVE = 10,
		MOUSE = 11,
		KEY = 12,
		BUILD = 13,
		TERMINAL = 14,
		FILE = 15
	}

	export interface IncomingEvent {
		emit(data: any);
	}

	export function addEvent(eventType: EventType, event: IncomingEvent) {
		events[eventType] = event;
	}

	export function removeEvent(eventType: EventType) {
		delete events[eventType];
	}

	export function emit(eventType: EventType, data: any) {
		let event = events[eventType];

		if (event !== undefined) {
			event.emit(data);
		} else {
			console.error("control: received unknown event", eventType);
		}
	}

	class DownloadProgressEvent implements Control.IncomingEvent {

		public emit(data) {
			data = JSON.parse(data);

			for (let t of Transfers.TRANSFERS) {
				if (t.remote === data.file) {
					t.progress = (data.read / data.total) * 100;

					if (data.read === data.total) {
						t.setStatus(Transfers.Status.COMPLETE, false);
					}

					if (data.key !== undefined) {
						t.key = data.key;
						document.location.href = "/download?key=" + data.key;
					}

					Transfers.update();

					break;
				}
			}
		}
	}

	class TransfersEvent implements Control.IncomingEvent {

		public emit(data) {
			if (data == null) {
				return;
			}

			let json = JSON.parse(data);

			if (json == null) {
				return;
			}

			for (let i = 0; i < json.length; i++) {
				let t = Transfer.create(json[i]);

				if (t.remote === "" && t.local === "") {
					continue;
				}

				Transfers.addTransfer(t, false);
			}
		}
	}

	export class Client {

		private socket: WebSocket;

		constructor() {
			addEvent(EventType.DOWNLOAD_PROGRESS, new DownloadProgressEvent());
			addEvent(EventType.TRANSFERS, new TransfersEvent());
		}

		public start() {
			this.reconnect();
		}

		public onOpen(func: any) {
			this.socket.addEventListener("open", func);
		}

		public write(eventType: Control.EventType, data: string, id?: number) {
			if (id === undefined) {
				id = 0;
			}

			this.socket.send(JSON.stringify({
				"event": eventType,
				"id": id,
				"data": data
			}));
		}

		private reconnect() {
			if (this.socket !== undefined) {
				this.socket.close();
			}
			this.socket = new WebSocket("wss://localhost:7777/control");
			this.socket.onmessage = (event) => this.onMessage(event);

			this.socket.onclose = () => {
				setTimeout(this.reconnect(), 1000);
				Connection.setConnectionStatus(false);
			};

			this.socket.onopen = () => {
				Connection.setConnectionStatus(true);
				console.log("control socket: connected");
			};
		}

		private onMessage(event) {
			let data = JSON.parse(event.data);
			Control.emit(data.event, data.data);
		}
	}

	export let instance: Control.Client = new Control.Client();

	export function init() {
		Control.instance.start();
	}
}

Control.init();
