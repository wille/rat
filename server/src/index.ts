import ClientServer from "./clientServer";
import ControlSocketServer from "./controlSocketServer";

new ControlSocketServer({
    port: 3000
});

new ClientServer(9999);