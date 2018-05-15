import { KeyPacket } from '~/client/packets';

import { clientServer } from '../..';
import { KeyTemplate } from '../../../../shared/src/templates/key';

export default (data: KeyTemplate) =>
  clientServer.getById(data, c => c.send(new KeyPacket(data)));
