import { ClientProperties, Monitor } from "../../shared/src/system";

class Client implements ClientProperties {

    public ping: number;
    public flag: string;
    public country: string;
    public username: string;
    public hostname: string;
    public monitors: Monitor[];

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
        this.monitors = properties.monitors || this.monitors;
    }
}

export default Client;
