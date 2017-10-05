namespace Web.Network.Events {
    
    interface TransfersParameters {
        id, progress: number;
        status: Transfers.Status;
        key, remote, local: string;
    }

    export class TransfersEvent implements IncomingEvent<TransfersParameters[]> {

        public emit(data: TransfersParameters[]) {
            for (let i = 0; i < data.length; i++) {
                let t = Transfer.create(data[i]);

                if (t.remote === "" && t.local === "") {
                    continue;
                }

                Transfers.addTransfer(t, false);
            }
        }
    }
}