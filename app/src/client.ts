import ClientProperties from "../../shared/src/clientProperties";

class Client implements ClientProperties {

    public ping: number;
    public flag: string;
    public country: string;
    public computerName: string;

    constructor(public readonly id: string,
                public readonly host: string) {

    }

    public update(properties: ClientProperties) {
        this.ping = properties.ping || this.ping;
        this.flag = properties.flag || this.flag;
        this.country = properties.country || this.country;
        this.computerName = properties.computerName || this.computerName;
    }
}

export default Client;
