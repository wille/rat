import { BSON } from 'bson';
import { Message } from 'shared/messages';

import store from '.';
import { resetClients } from './actions';
import { SubscribeMessage } from './messages/outgoing-messages';
import { selectSubscriptions } from './reducers';

class ControlSocket {
  private readonly bson = new BSON();
  private socket: WebSocket;
  private queue: Message[] = [];

  private attempt = 0;

  constructor(private readonly url: string) {}

  public connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onmessage = (e: MessageEvent) => this.handleMessage(e);
    this.socket.onclose = (e: CloseEvent) => this.onClose(e);
    this.socket.onopen = () => this.onOpen();
  }

  public send(m: Message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(this.bson.serialize(m));
    } else {
      console.warn(
        '[ws] sending data in invalid state:',
        this.socket.readyState
      );
      this.queue.push(m);
    }
  }

  private onOpen() {
    console.log('[ws] connected');

    store.dispatch(resetClients());

    this.attempt = 0;

    this.sendSubscriptions();

    this.queue.forEach(queued => this.send(queued));
    this.queue = [];
  }

  private sendSubscriptions() {
    selectSubscriptions(store.getState()).forEach(event =>
      this.send(
        new SubscribeMessage({
          type: event.type,
          subscribe: true,
        })
      )
    );
  }

  private emit(message: Message) {
    selectSubscriptions(store.getState())
      .filter(event => event.type === message._type)
      .forEach(event => event.handler(message.data));
  }

  private handleMessage(e: MessageEvent) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const bson = this.bson.deserialize(Buffer.from(reader.result));
      this.emit(bson);
    };

    reader.readAsArrayBuffer(e.data);
  }

  private onClose(e: CloseEvent) {
    let delay = 10000;

    if (this.attempt < 5) {
      delay = 1000;
    } else if (this.attempt < 15) {
      delay = 5000;
    }

    this.attempt++;

    this.reconnect(delay);
  }

  /**
   * start delayed connection attempt
   * @param delay
   */
  private reconnect(delay: number) {
    console.log(
      `[ws] trying to reconnect in ${delay / 1000}s, attempt ${this.attempt}`
    );
    setTimeout(() => this.connect(), delay);
  }
}

export default new ControlSocket('wss://localhost:3000');
