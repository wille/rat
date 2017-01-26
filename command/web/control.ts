namespace Control {

	var events: IncomingEvent[] = [];

	export enum EventType {
		SCREEN = 0
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

		constructor() {

		}

		public start(func: any) {
			this.reconnect();
			this.socket.onopen = () => func();
		}

		private reconnect() {
			if (this.socket != undefined) {
				this.socket.close();
			}
			this.socket = new WebSocket("wss://localhost:7777/control");
			this.socket.onmessage = (event) => this.onMessage(event);
			this.socket.onclose = () => setTimeout(this.reconnect(), 1000);
		}

		private onMessage(event) {
			let data = JSON.parse(event.data);
			Control.emit(data.Event, data.Data);
		}

		public onOpen(func: any) {
			this.socket.addEventListener("onopen", func);
		}

		public write(eventType: Control.EventType, data: string, id?: number) {
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

	export var instance: Control.Client = new Control.Client();

	export function init(func: any) {
		Control.instance.start(func);
	}
}
