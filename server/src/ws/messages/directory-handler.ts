import { clientServer } from '../..';
import { BrowseTemplate } from '../../../../shared/src/templates';
import { BrowseMessage } from '../messages';

export default (data: BrowseTemplate) =>
  clientServer.getById(data.id, c => c.send(new BrowseMessage(data)));
