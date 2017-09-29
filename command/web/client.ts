
class Client {

    public static clients: Client[] = [];

    public ping: number;
    public readonly operatingSystem: OperatingSystem;

    constructor(public readonly id: ClientId,
                public readonly flag: string,
                public readonly country: string,
                public readonly host: string,
                public readonly computerName: string,
                osType: string,
                osDisplay: string) {
        
        this.operatingSystem = {
            type: OperatingSystemType[osType],
            display: osDisplay
        }
    }

    public get separator() {
        return this.operatingSystem.type === OperatingSystemType.Windows ? "\\" : "/";
    }
    
    private sys(action: SysAction) {
        Control.instance.send(new SysMessage(action), this);
    }

    public disconnect() {
        this.sys(SysAction.DISCONNECT);
    }

    public shutdown() {
        this.sys(SysAction.SHUTDOWN);
    }

    public reboot() {
        this.sys(SysAction.REBOOT);
    }

    public static getById(id: number): Client | null {
        for (let client of Client.clients) {
            if (client && client.id === id) {
                return client;
            }
        }

        return null;
    }
}
