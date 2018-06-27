import Client from '~/client/client';
import { MousePacket } from '~/client/packets';

import { MouseTemplate } from 'shared/templates/mouse';

export default (data: MouseTemplate, _, client: Client) =>
  client.send(new MousePacket(data));
