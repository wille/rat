import { clientServer } from '../..';
import { KeyTemplate } from '../../../../shared/src/templates/key';
import { KeyMessage } from '../messages';

export default (data: KeyTemplate) =>
  clientServer.getById(data, c => c.send(new KeyMessage(data)));
