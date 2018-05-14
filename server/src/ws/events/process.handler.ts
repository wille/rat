import { MessageHandler } from '.';
import { clientServer } from '../..';
import { ProcessTemplate } from '../../../../shared/src/templates/process';
import { ProcessMessage } from '../messages';

export default class ProcessHandler implements MessageHandler<ProcessTemplate> {
  public handle(data: ProcessTemplate) {
    clientServer.getById(data, c => c.send(new ProcessMessage(data)));
  }
}
