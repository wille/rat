import { BrowsePacket } from '~/client/packets';
import { clientServer } from '../..';
import { BrowseTemplate } from '../../../../shared/src/templates';

export default (data: BrowseTemplate) =>
  clientServer.getById(data.id, c => c.send(new BrowsePacket(data)));
