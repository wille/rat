import ClientServer from "./clientServer";
import ControlSocketServer from "./controlSocketServer";

export const controlSocket = new ControlSocketServer({
    port: 3000
});

export const clientServer = new ClientServer(9999);
