import { MessageHandler } from '.';
import { clientServer } from '../..';
import { BrowseTemplate } from '../../../../shared/src/templates';
import { BrowseMessage } from '../messages';

export default class BrowseHandler implements MessageHandler<BrowseTemplate> {
  public handle(data: BrowseTemplate) {
    clientServer.getById(data.id, c => c.send(new BrowseMessage(data)));
  }
}
