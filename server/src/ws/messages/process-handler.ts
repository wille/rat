import Client from '~/client/client';
import { ProcessPacket } from '~/client/packets';

import { ProcessTemplate } from '../../../../shared/src/templates/process';

export default (data: ProcessTemplate, _, client: Client) =>
  client.send(new ProcessPacket(data));
