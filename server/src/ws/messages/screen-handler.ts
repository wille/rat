import { clientServer } from '../..';
import { ScreenTemplate } from '../../../../shared/src/templates';
import { ScreenMessage } from '../messages';

export default (data: ScreenTemplate) =>
  clientServer.getById(data, c => c.send(new ScreenMessage(data)));
