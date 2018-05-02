import { MessageHandler } from '.';
import { clientServer } from '../..';
import StreamMessage from '../../../../shared/src/messages/stream';
import { ScreenTemplate } from '../../../../shared/src/templates';

class ScreenHandler implements MessageHandler<ScreenTemplate> {
  public handle(data: ScreenTemplate) {
    clientServer.getById(data, c => c.send(new StreamMessage(data)));
  }
}

export default ScreenHandler;
