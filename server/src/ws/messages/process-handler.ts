import { clientServer } from '../..';
import { ProcessTemplate } from '../../../../shared/src/templates/process';
import { ProcessMessage } from '../messages';

export default (data: ProcessTemplate) =>
  clientServer.getById(data, c => c.send(new ProcessMessage(data)));
