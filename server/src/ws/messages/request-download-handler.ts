import { RequestDownloadTemplate } from 'shared/templates';
import Client from '~/client/client';
import { RequestDownload } from '~/client/packets';

export default (data: RequestDownloadTemplate, _, client: Client) =>
  client.send(new RequestDownload(data));
