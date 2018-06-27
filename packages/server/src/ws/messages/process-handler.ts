import Client from '~/client/client';
import { ProcessPacket } from '~/client/packets';

import { ProcessTemplate } from 'shared/templates/process';

export default (data: ProcessTemplate, _, client: Client) =>
  client.send(new ProcessPacket(data));
