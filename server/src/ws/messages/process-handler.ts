import { ProcessPacket } from '~/client/packets';

import { clientServer } from '../..';
import { ProcessTemplate } from '../../../../shared/src/templates/process';

export default (data: ProcessTemplate) =>
  clientServer.getById(data, c => c.send(new ProcessPacket(data)));
