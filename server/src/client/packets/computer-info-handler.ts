import { ClientProperties } from '../../../../shared/src/system';
import { MessageTemplate } from '../../../../shared/src/templates';
import { ClientUpdateType } from '../../../../shared/src/templates/client';
import ControlSocketServer from '../../control-socket';
import { ClientMessage } from '../../ws/messages';
import Client from '../client';

type ComputerInfoTemplate = MessageTemplate & ClientProperties;

export default (data: ComputerInfoTemplate, client: Client) => {
  client.hostname = data.hostname;
  client.username = data.username;
  client.monitors = data.monitors;
  client.os = data.os;

  ControlSocketServer.broadcast(
    new ClientMessage({
      type: ClientUpdateType.UPDATE,
      ...client.getSystemProperties(),
    }),
    true
  );
};
