/// <reference path="events/downloadProgress.event.ts" />
/// <reference path="events/client.event.ts" />
/// <reference path="messages/transfers.message.ts" />
/// <reference path="events/transfers.event.ts" />

namespace Control {

	let events: IncomingEvent<any>[] = [];

	export enum MessageType {
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

	export function addEvent(eventType: MessageType, event: IncomingEvent<any>) {
		events[eventType] = event;
	}

	export function removeEvent(eventType: MessageType) {
		delete events[eventType];
	}

	export function emit(eventType: MessageType, data: any) {
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

	interface MessageHeader {
		event: MessageType;
		id: number;
	}

	interface LoginParameters {
		key: string;
	}

	export class Socket {

		public authenticated: boolean;
		
		private key: string;
		private socket: WebSocket;

		private currentType: MessageType;

		constructor() {
			addEvent(MessageType.DOWNLOAD_PROGRESS, new DownloadProgressEvent());
			addEvent(MessageType.TRANSFERS, new TransfersEvent());
			addEvent(MessageType.CLIENT_UPDATE, new ClientUpdateEvent());
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
			
			let header: MessageHeader = {
				event: data.header,
				id: id
			}

			this.writeMessage(header, data.params);
		}

		private writeMessage(header: MessageHeader, data: any) {
			this.socket.send(JSON.stringify(header));
			this.socket.send(JSON.stringify(data));
		}

		private write(data: any) {
			this.socket.send(JSON.stringify(data));
		}

		private reconnect() {
			if (this.socket !== undefined) {
				this.socket.close();
			}
			this.socket = new WebSocket(Config.controller + "/control");
			this.socket.onmessage = (event: MessageEvent) => this.onMessage(event);

			this.socket.onclose = () => this.onClose();

			this.socket.onopen = () => this.onOpen();
		}

		private onOpen() {
			Connection.setConnectionStatus(true);
			console.log("control socket: connected");

			this.write({ key: "key" } as LoginParameters);
		}

		private onMessage(event: MessageEvent) {
			let data: MessageHeader = JSON.parse(event.data);

			if (data.event) {
				if (this.currentType) {
					this.close();
					return;
				}

				this.currentType = data.event;
			} else {
				Control.emit(this.currentType, data);
				this.currentType = null;
			}
		}

		public close(reason?: string) {
			this.socket.close();

			if (reason) {
				console.error("closed websocket:", reason);
			}
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

	export function stop(reason?: string) {
		Control.instance.close(reason);
	}
}
