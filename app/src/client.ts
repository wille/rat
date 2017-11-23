import { ObjectId } from "bson";

class Client {

    public ping: number;

    constructor(public readonly id: number,
                public readonly flag: string,
                public readonly country: string,
                public readonly host: string,
                public readonly computerName: string,
                osType: string,
                osDisplay: string) {
    }
}

export default Client;
