import { PacketHandler } from '~/client/packets';

import { ScreenFrameTemplate } from '../../../../shared/src/templates';
import ControlSocketServer from '../../controlSocketServer';
import ScreenFrameMessage from '../../ws/messages/screenFrame.message';
import Client from '../client';

class ScreenFrameHandler implements PacketHandler<ScreenFrameTemplate> {

  public handle(client: Client, data: ScreenFrameTemplate) {
    ControlSocketServer.broadcast(new ScreenFrameMessage({
      width: data.width,
      height: data.height,
      data: data.buffer
    }));
  }
}

export default ScreenFrameHandler;
