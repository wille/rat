import { PacketHandler } from '.';
import { DirectoryContentTemplate } from '../../../../shared/src/templates';
import ControlSocketServer from '../../control-socket';
import DirectoryContentMessage from '../../ws/messages/directory.message';
import Client from '../client';

export default class DirectoryContentHandler
  implements PacketHandler<DirectoryContentTemplate> {
  public handle(data: DirectoryContentTemplate, client: Client) {
    ControlSocketServer.broadcast(
      new DirectoryContentMessage({
        id: client.id,
        ...data,
      })
    );
  }
}
