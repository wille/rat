import { clientServer } from '../..';
import { MouseMotionTemplate } from '../../../../shared/src/templates/mouse';
import { MouseMoveMessage } from '../messages';

export default (data: MouseMotionTemplate) =>
  clientServer.getById(data, c => c.send(new MouseMoveMessage(data)));
