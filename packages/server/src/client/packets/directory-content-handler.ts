import { DirectoryContentTemplate } from 'shared/templates';
import ControlSocketServer from '../../control-socket';
import { DirectoryContentMessage } from '../../ws/messages';
import Client from '../client';

export default (data: DirectoryContentTemplate, client: Client) =>
  ControlSocketServer.broadcast(
    new DirectoryContentMessage({
      id: client.id,
      ...data,
    })
  );
