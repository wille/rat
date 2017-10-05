/// <reference path="events/downloadProgress.event.ts" />
/// <reference path="events/client.event.ts" />
/// <reference path="messages/transfers.message.ts" />
/// <reference path="events/transfers.event.ts" />

namespace Web.Network {

    import Event = Web.Network.Events;
    import DownloadProgressEvent = Events.DownloadProgressEvent;
    import ClientUpdateEvent = Events.ClientUpdateEvent;
    import TransfersEvent = Events.TransfersEvent;
    import OutgoingMessage = Messages.OutgoingMessage;

    /**
     * A message header is sent as a websocket me
     */
    interface IMessageHeader {
        event: Header;
        id: number;
    }

    interface ILoginParameters {
        key: string;
    }

    class ControlSocket {

        /**
         * If authenticated with server
         */
        public authenticated: boolean;

        private key: string;
        private socket: WebSocket;

        private currentType: Header;

        constructor(private readonly url: string) {
            Event.addEvent(Header.DownloadProgress, new DownloadProgressEvent());
            Event.addEvent(Header.FileTransfers, new TransfersEvent());
            Event.addEvent(Header.ClientUpdate, new ClientUpdateEvent());
        }

        public open(key: string) {
            this.key = key;
            this.connect();
        }

        public send(data: OutgoingMessage<any>, client?: Client) {
            let id = 0;

            if (client) {
                id = client.id;
            }

            let header: IMessageHeader = {
                event: data.header,
                id
            };

            this.writeMessage(header, data.params);
        }

        /**
         * Close the connection
         * @param reason
         */
        public close(reason?: string) {
            this.socket.close();

            if (reason) {
                console.error("closed websocket:", reason);
            }
        }

        private writeMessage(header: IMessageHeader, data: any) {
            this.socket.send(JSON.stringify(header));
            this.socket.send(JSON.stringify(data));
        }

        private write(data: any) {
            this.socket.send(JSON.stringify(data));
        }

        private connect() {
            if (this.socket !== undefined) {
                this.socket.close();
            }
            this.socket = new WebSocket(this.url);
            this.socket.onmessage = (event: MessageEvent) => this.onMessage(event);

            this.socket.onclose = () => this.onClose();
            this.socket.onopen = () => this.onOpen();
        }

        private onOpen() {
            Connection.setConnectionStatus(true);
            console.log("control socket: connected");

            this.write({ key: "key" } as ILoginParameters);
        }

        private onMessage(event: MessageEvent) {
            // parse incoming data as JSON
            let object: IMessageHeader | any = JSON.parse(event.data);

            // object is event
            if (object.event) {
                // expected type already set, abort
                if (this.currentType) {
                    this.close("invalid message order");
                    return;
                }

                this.currentType = object.event as Header;
            } else {
                // broadcast incoming message to all listeners
                Event.emit(this.currentType, object);
                this.currentType = null;
            }
        }

        /**
         * Closed event
         */
        private onClose() {
            // If previously authenticated, connect again
            if (this.authenticated) {
                setTimeout(this.connect(), 1000);
            }

            Connection.setConnectionStatus(false);
        }
    }

    /**
     * Control socket instance
     */
    export const Socket = new ControlSocket(Config.controller + "/control");
}
