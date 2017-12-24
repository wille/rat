import ControlSocketServer from '../../controlSocketServer';
import Client from '../client';
import { PacketHandler } from './index';

class PongHandler implements PacketHandler<{}> {

  public handle(client: Client, data: {}) {
    client.pong();
  }
}

export default PongHandler;
