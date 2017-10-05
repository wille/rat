namespace Web.Network.Events {

    export interface IncomingEvent<T> {
        emit(data: T);
    }
}
