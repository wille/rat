import ClientProperties from "../../shared/src/clientProperties";

class Client implements ClientProperties {

    public ping: number;
    public flag: string;
    public country: string;
    public username: string;
    public hostname: string;

    constructor(public readonly id: string,
                public readonly host: string) {

    }

    public get identifier() {
        return this.username + "@" + this.hostname;
    }

    public update(properties: ClientProperties) {
        this.ping = properties.ping || this.ping;
        this.flag = properties.flag || this.flag;
        this.country = properties.country || this.country;
        this.username = properties.username || this.username;
        this.hostname = properties.hostname || this.hostname;
    }
}

export default Client;
