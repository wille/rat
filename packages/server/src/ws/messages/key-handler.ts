import Client from '../../client/client';
import { KeyPacket } from '../../client/packets';

import { KeyTemplate } from 'shared/templates/key';

export default (data: KeyTemplate, _, client: Client) =>
  client.send(new KeyPacket(data));
