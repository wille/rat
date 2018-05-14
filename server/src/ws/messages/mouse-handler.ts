import { clientServer } from '../..';
import { MouseTemplate } from '../../../../shared/src/templates/mouse';
import { MouseMessage } from '../messages';

export default (data: MouseTemplate) =>
  clientServer.getById(data, c => c.send(new MouseMessage(data)));
