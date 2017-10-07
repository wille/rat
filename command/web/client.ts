/// <reference path="network/messages/sys.message.ts" />

namespace Web {

    import SysAction = Network.Messages.SysAction;
    import SysMessage = Network.Messages.SysMessage;

    export class Client {

        public static clients: Client[] = [];

        /**
         * Get a client by their unique ID
         * @param id
         */
        public static getById(id: number): Client | null {
            for (let client of Client.clients) {
                if (client && client.id === id) {
                    return client;
                }
            }

            return null;
        }

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
            };
        }

        /**
         * The path separator of this clients system
         */
        public get separator() {
            return this.operatingSystem.type === OperatingSystemType.Windows ? "\\" : "/";
        }

        public disconnect() {
            this.sys(SysAction.Disconnect);
        }

        public shutdown() {
            this.sys(SysAction.Shutdown);
        }

        public reboot() {
            this.sys(SysAction.Reboot);
        }

        public uninstall() {
            this.sys(SysAction.Uninstall);
        }

        private sys(action: SysAction) {
            Web.Network.Socket.send(new SysMessage({
                action
            }), this);
        }
    }
}
