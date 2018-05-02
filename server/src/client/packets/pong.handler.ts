import { PacketHandler } from '.';
import Client from '../client';

class PongHandler implements PacketHandler<never> {
  public handle(data: never, client: Client) {
    client.pong();
  }
}

export default PongHandler;
