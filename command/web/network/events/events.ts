namespace Web.Network.Events {

    let events: IncomingEvent<any>[][] = [];

    export function addEvent(eventType: Header, event: IncomingEvent<any>) {
        if (!events[eventType]) {
            events[eventType] = [];
        }

        events[eventType].push(event);
    }

    export function removeEvent(eventType: Header) {
        delete events[eventType];
    }

    /**
     * Emit an incoming event
     * @param eventType
     * @param data
     */
    export function emit(eventType: Header, data: any) {
        let event = events[eventType][0];

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
}
