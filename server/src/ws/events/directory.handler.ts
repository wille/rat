import { MessageHandler } from '.';
import { clientServer } from '../..';
import BrowseMessage from '../../../../shared/src/messages/browse';
import { BrowseTemplate } from '../../../../shared/src/templates';

export default class BrowseHandler implements MessageHandler<BrowseTemplate> {
  public handle(data: BrowseTemplate) {
    clientServer.getById(data.id, c => c.send(new BrowseMessage(data)));
  }
}
