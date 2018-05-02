import { MessageHandler } from '.';
import { clientServer } from '../..';
import ProcessMessage from '../../../../shared/src/messages/process';
import { ProcessTemplate } from '../../../../shared/src/templates/process';

export default class ProcessHandler implements MessageHandler<ProcessTemplate> {
  public handle(data: ProcessTemplate) {
    clientServer.getById(data, c => c.send(new ProcessMessage(data)));
  }
}
