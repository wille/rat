import ControlSocket from "@app/control";
import Message from "@shared/messages";
import { ClientProperties, Monitor, OperatingSystem } from "@shared/system";

class Client implements ClientProperties {

    public ping: number;
    public flag: string;
    public country: string;
    public username: string;
    public hostname: string;
    public monitors: Monitor[];
    public os: OperatingSystem;

    constructor(public readonly id: string,
                public readonly host: string) {

    }

    public get identifier() {
        return this.username + "@" + this.hostname;
    }

    public get separator() {
        return this.os.type === "Windows" ? "\\" : "/";
    }

    public update(properties: ClientProperties) {
        this.ping = properties.ping || this.ping;
        this.flag = properties.flag || this.flag;
        this.country = properties.country || this.country;
        this.username = properties.username || this.username;
        this.hostname = properties.hostname || this.hostname;
        this.monitors = properties.monitors || this.monitors;
        this.os = properties.os || this.os;
    }

    public send(m: Message) {
        m.data._id = this.id;
        ControlSocket.send(m);
    }
}

export default Client;
