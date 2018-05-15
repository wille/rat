import { MouseMovePacket } from '~/client/packets';

import { clientServer } from '../..';
import { MouseMotionTemplate } from '../../../../shared/src/templates/mouse';

export default (data: MouseMotionTemplate) =>
  clientServer.getById(data, c => c.send(new MouseMovePacket(data)));
