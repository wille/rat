/// <reference path="messages/incoming/downloadProgress.event.ts" />
/// <reference path="messages/incoming/transfers.event.ts" />
/// <reference path="messages/incoming/client.event.ts" />

namespace Control {

	let events: IncomingMessage<any>[] = [];

	export enum EventType {
		CLIENT_UPDATE = 1,
		SYS = 2,
		DIRECTORY = 3, // directory.event.ts
		DOWNLOAD = 4, // download.event.ts
		TRANSFERS = 5,
		DOWNLOAD_PROGRESS = 6,
		SCREEN = 7, // screen.event.ts
		PROCESS = 8, // process.event.ts
		MONITOR = 9, // monitor.event.ts
		MOUSE_MOVE = 10,
		MOUSE = 11,
		KEY = 12,
		BUILD = 13,
		TERMINAL = 14,
		FILE = 15,
		EXIT = 16,
		LOGIN = 17, // login.event.ts
		WINDOWS = 18
	}

	export function addEvent(eventType: EventType, event: IncomingMessage<any>) {
		events[eventType] = event;
	}

	export function removeEvent(eventType: EventType) {
		delete events[eventType];
	}

	export function emit(eventType: EventType, data: any) {
		let event = events[eventType];

		if (event) {
			try {
				data = JSON.parse(data);
			} catch (e) {
				if (!(e instanceof SyntaxError)) {
					throw e;
				}
			}

			event.emit(data);
		} else {
			console.error("control: received unknown event", eventType);
		}
	}

	interface MessageParameters {
		event: EventType;
		id: number;
		data: any;
	}

	interface LoginParameters {
		key: string;
	}

	export class Socket {

		public authenticated: boolean;
		
		private key: string;
		private socket: WebSocket;

		constructor() {
			addEvent(EventType.DOWNLOAD_PROGRESS, new DownloadProgressEvent());
			addEvent(EventType.TRANSFERS, new TransfersEvent());
			addEvent(EventType.CLIENT_UPDATE, new ClientUpdateEvent());
		}

		public start(key: string) {
			this.key = key;
			this.reconnect();
		}

		public send(data: OutgoingMessage<any>, client?: Client) {
			let id = 0;

			if (client) {
				id = client.id;
			}

			this.writeMessage({
				event: data.header,
				id: id,
				data: data.params
			} as MessageParameters);
		}

		public stop() {
			this.socket.close();
		}

		private writeMessage(data: MessageParameters) {
			this.socket.send(JSON.stringify({ id: data.id, event: data.event }));
			this.socket.send(JSON.stringify(data.data));
		}

		private write(data: any) {
			this.socket.send(JSON.stringify(data));
		}

		private reconnect() {
			if (this.socket !== undefined) {
				this.socket.close();
			}
			this.socket = new WebSocket("wss://localhost:7777/control");
			this.socket.onmessage = (event: MessageEvent) => this.onMessage(event);

			this.socket.onclose = () => this.onClose();

			this.socket.onopen = () => this.onOpen();
		}

		private onOpen() {
			Connection.setConnectionStatus(true);
			console.log("control socket: connected");

			this.write({ key: "key" } as LoginParameters);
		}

		private latest;

		private onMessage(event: MessageEvent) {

			let data: MessageParameters = JSON.parse(event.data);
			console.log(data);
			if (data.event) {
				this.latest = data.event;
				return;
			}

			Control.emit(this.latest, data);
		}

		private onClose() {
			if (this.authenticated) {
				setTimeout(this.reconnect(), 1000);
			}

			Connection.setConnectionStatus(false);
		}
	}

	export let instance: Control.Socket = new Control.Socket();

	export function init(key: string) {
		Control.instance.start(key);
	}

	export function stop() {
		Control.instance.stop();
	}
}
