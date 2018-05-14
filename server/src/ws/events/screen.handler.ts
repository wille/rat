import { MessageHandler } from '.';
import { clientServer } from '../..';
import { ScreenTemplate } from '../../../../shared/src/templates';
import { ScreenMessage } from '../messages';

class ScreenHandler implements MessageHandler<ScreenTemplate> {
  public handle(data: ScreenTemplate) {
    clientServer.getById(data, c => c.send(new ScreenMessage(data)));
  }
}

export default ScreenHandler;
