import { PacketHandler } from '.';

import { ProcessListTemplate } from '../../../../shared/src/templates/process';
import ControlSocketServer from '../../control-socket';
import { ProcessListMessage } from '../../ws/messages';

export default class ProcessListHandler
  implements PacketHandler<ProcessListTemplate> {
  public handle(data: ProcessListTemplate) {
    ControlSocketServer.broadcast(new ProcessListMessage(data));
  }
}
