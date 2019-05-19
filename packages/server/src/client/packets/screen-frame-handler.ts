import { ScreenFrameTemplate } from 'shared/templates';
import ControlSocketServer from '../../control-socket';
import { ScreenFrameMessage } from '../../ws/messages';

export default (data: ScreenFrameTemplate) =>
  ControlSocketServer.broadcast(
    new ScreenFrameMessage({
      width: data.width,
      height: data.height,
      data: data.buffer,
    })
  );
