import { PacketHandler } from '~/client/packets';

import { ScreenFrameTemplate } from '../../../../shared/src/templates';
import ControlSocketServer from '../../control-socket';
import ScreenFrameMessage from '../../ws/messages/screenFrame.message';

class ScreenFrameHandler implements PacketHandler<ScreenFrameTemplate> {
  public handle(data: ScreenFrameTemplate) {
    ControlSocketServer.broadcast(
      new ScreenFrameMessage({
        width: data.width,
        height: data.height,
        data: data.buffer,
      })
    );
  }
}

export default ScreenFrameHandler;
