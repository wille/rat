namespace Control {

	var events: IncomingEvent[] = [];

	export enum EventType {
		SCREEN = 0,
		PROCESS = 1
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

	export class Client {

		private socket: WebSocket;

		constructor() {

		}

		public start() {
			this.reconnect();
		}

		public onOpen(func: any) {
			this.socket.addEventListener("onopen", func);
		}

		public write(eventType: Control.EventType, data: string, id?: number) {
			if (id === undefined) {
				id = 0;
			}

			this.socket.send(JSON.stringify({
				"Event": eventType,
				"ClientId": id,
				"Data": data
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
			Control.emit(data.Event, data.Data);
		}

	}

	export let instance: Control.Client = new Control.Client();

	export function init() {
		Control.instance.start();
	}
}

Control.init();
