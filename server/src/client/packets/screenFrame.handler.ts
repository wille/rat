import { PacketHandler } from "~/client/packets";

import ControlSocketServer from "../../controlSocketServer";
import ScreenFrameMessage from "../../ws/messages/screenFrame.message";
import Client from "../client";

interface ScreenTemplate {
    buffer: Buffer;
}

class ScreenFrameHandler implements PacketHandler<ScreenTemplate> {

    public handle(client: Client, data: ScreenTemplate) {
        ControlSocketServer.broadcast(new ScreenFrameMessage({
            buffer: data.buffer
        }));
    }
}

export default ScreenFrameHandler;
