import { PacketHandler } from '~/client/packets';

import { ProcessListTemplate } from '../../../../shared/src/templates/process';
import ControlSocketServer from '../../control-socket';
import ProcessListMessage from '../../ws/messages/process.message';

export default class ProcessListHandler
  implements PacketHandler<ProcessListTemplate> {
  public handle(data: ProcessListTemplate) {
    ControlSocketServer.broadcast(new ProcessListMessage(data));
  }
}
