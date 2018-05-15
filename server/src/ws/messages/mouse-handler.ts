import { MousePacket } from '~/client/packets';

import { clientServer } from '../..';
import { MouseTemplate } from '../../../../shared/src/templates/mouse';

export default (data: MouseTemplate) =>
  clientServer.getById(data, c => c.send(new MousePacket(data)));
