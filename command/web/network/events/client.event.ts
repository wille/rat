/// <reference path="../../ui/containers/mainview.container.ts" />

namespace Web.Network.Events {

    import TableCell = UI.Views.TableCell;
    import Containers = UI.Containers;

    const enum ClientUpdateType {
        // Add client, on server connect or web panel open
        ADD = 0,

        // Update client data
        UPDATE = 1,

        // Remove client
        REMOVE = 2
    }

    interface ClientUpdateParameters {

        type: ClientUpdateType;
        // client id
        id: number;

        data: {
            ping: number;
            flag?: string;
            country?: string;
            host?: string;
            computerName?: string;
            osType?: string;
            operatingSystem?: string;
        }
    }

    export class ClientUpdateEvent implements IncomingEvent<ClientUpdateParameters> {

        public emit(data: ClientUpdateParameters) {
            let params = data.data;
            console.log(params);

            let client: Client;

            switch (data.type) {
                case ClientUpdateType.ADD:
                    if (!Client.getById(data.id)) {
                        client = new Client(data.id, params.flag, params.country, params.host, params.computerName, params.osType, params.operatingSystem);

                        Client.clients.push(client);
                        Containers.MainViewContainer.clientsView.add(client);
                    }
                    break;
                case ClientUpdateType.UPDATE:
                    client = Client.getById(data.id);

                    if (typeof params.ping === "number") {
                        Containers.MainViewContainer.clientsView.setCell(client, TableCell.PING, client.ping = params.ping);
                    }

                    break;
                case ClientUpdateType.REMOVE:
                    client = Client.getById(data.id);
                    Containers.MainViewContainer.clientsView.remove(client);

                    delete Client.clients[Client.clients.indexOf(client)];
                    break;
            }
        }
    }
}
