import Client from '@app/client';
import TabbedView from '@components/tabs/TabPage';

export default abstract class ClientView extends TabbedView {

  constructor(title: string, protected readonly client: Client) {
    super(title);
  }
}
