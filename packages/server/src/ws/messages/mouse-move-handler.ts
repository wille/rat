import Client from '~/client/client';
import { MouseMovePacket } from '~/client/packets';

import { MouseMotionTemplate } from 'shared/templates/mouse';

export default (data: MouseMotionTemplate, _, client: Client) =>
  client.send(new MouseMovePacket(data));
