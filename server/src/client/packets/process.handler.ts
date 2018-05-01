import { PacketHandler } from '~/client/packets';

import { ProcessListTemplate } from '../../../../shared/src/templates/process';
import ControlSocketServer from '../../control-socket';
import ProcessListMessage from '../../ws/messages/process.message';
import Client from '../client';

export default class ProcessListHandler implements PacketHandler<ProcessListTemplate> {

  public handle(client: Client, data: ProcessListTemplate) {
    ControlSocketServer.broadcast(new ProcessListMessage(data));
  }
}
