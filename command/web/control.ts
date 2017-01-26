namespace Control {

	export var instance: Control.Client;
	var events: IncomingEvent[] = [];

	export enum EventType {
		SCREEN
	}

	export interface IncomingEvent {
		emit(data: any);
	}

	export function addEvent(eventType: EventType, event: IncomingEvent) {
		events[eventType] = event;
	}

	export function emit(eventType: EventType, data: any) {
		events[eventType].emit(data);
	}

 	export class Client {

		private socket: WebSocket;

		constructor(private id: number) { }

		public start() {
			this.reconnect();
		}

		private reconnect() {
			if (this.socket != undefined) {
				this.socket.close();
			}
			this.socket = new WebSocket("wss://localhost:7777/control");
			this.socket.onmessage = (event) => this.onMessage(event);
			this.socket.onopen = () => this.onOpen();
			this.socket.onclose = () => setTimeout(this.reconnect(), 1000);
		}

		private onMessage(event) {
			let data = JSON.parse(event.data);
			Control.emit(data.Event, data.Data);
		}

		private onOpen() {
			this.socket.send(this.id + "\n");
		}

		public write(eventType: Control.EventType, data: any, id?: number) {
			if (id == undefined) {
				id = 0;
			}

			this.socket.send(JSON.stringify({
				"Event": eventType,
				"ClientId": id,
				"Data": data
			}));
		}
	}

	export function init(id: number) {
		this.instance = new Control.Client(id);
		this.instance.start();
	}
}
