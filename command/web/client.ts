interface ClientFields {
    ping?: number;
    flag?, country?: string;
    host?, computerName?, operatingSystem?: string;
}

class Client implements ClientFields {

    public static clients: Client[] = [];

    readonly flag: string;
    readonly country: string;
    readonly host: string;
    readonly computerName: string;
    readonly operatingSystem: string;

    public ping: number;

    constructor(public readonly id: ClientId, fields?: ClientFields) {
        if (fields) {
            for (let p in fields) {
                if (fields.hasOwnProperty(p)) {
                    this[p] = fields[p];
                }
            }
        }
    }

    public static getById(id: number): Client | null {
        for (let client of Client.clients) {
            if (client.id === id) {
                return client;
            }
        }

        return null;
    }
}
