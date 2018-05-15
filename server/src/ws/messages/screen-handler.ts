import { ScreenPacket } from '~/client/packets';

import { clientServer } from '../..';
import { ScreenTemplate } from '../../../../shared/src/templates';

export default (data: ScreenTemplate) =>
  clientServer.getById(data, c => c.send(new ScreenPacket(data)));
