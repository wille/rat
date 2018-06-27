import { ProcessListTemplate } from 'shared/templates/process';
import ControlSocketServer from '../../control-socket';
import { ProcessListMessage } from '../../ws/messages';

export default (data: ProcessListTemplate) =>
  ControlSocketServer.broadcast(new ProcessListMessage(data));
