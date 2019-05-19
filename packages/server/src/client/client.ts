import { BSON, ObjectId } from 'bson';
import { TLSSocket } from 'tls';

import { Message } from 'shared/messages';
import { ClientProperties, Monitor, UserOperatingSystem } from 'shared/system';
import { ClientUpdateType } from 'shared/templates';
import ControlSocketServer from '../control-socket';
import { ClientMessage } from '../ws/messages';
import { PacketType, PingPacket, selectHandler } from './packets';

class Client implements ClientProperties {
  /**
   * Current ping in milliseconds
   */
  public ping: number;

  /**
   * Username of client machine
   */
  public username: string;

  /**
   * Hostname of client machine
   */
  public hostname: string;

  /**
   * Client monitors
   */
  public monitors: Monitor[];

  /**
   * Client operating system
   */
  public os: UserOperatingSystem;

  /**
   * Unique client ID
   */
  private readonly _id = new ObjectId();

  /**
   * Timestamp for last sent ping
   */
  private pingTime: number;

  /**
   * Country resolved from
   */
  private lookup: { country: string } = { country: null };

  constructor(private readonly socket: TLSSocket) {
    this.loop();
  }

  public get id() {
    return this._id.toHexString();
  }

  public get host() {
    return this.socket.remoteAddress;
  }

  public disconnect() {
    this.socket.end();
  }

  public sendPing() {
    this.send(new PingPacket({}));
    this.pingTime = new Date().getTime();
  }

  public pong() {
    const now = new Date().getTime();
    const ping = now - this.pingTime;

    ControlSocketServer.broadcast(
      new ClientMessage({
        type: ClientUpdateType.UPDATE,
        id: this.id,
        ping,
      }),
      true
    );
  }

  /**
   * Sends the message to the client
   * @param m
   */
  public send(m: Message) {
    try {
      const data = new BSON().serialize(m.data);

      const header = new Buffer(2);
      header.writeInt16LE(m._type, 0);

      const len = new Buffer(4);
      len.writeInt32LE(data.length, 0);

      this.socket.write(header);
      this.socket.write(len);
      this.socket.write(data);
    } catch (ex) {
      this.disconnect();
      throw ex;
    }
  }

  /**
   * Returns all the client properties
   */
  public getClientProperties(): ClientProperties {
    return {
      id: this.id,
      host: this.host,
      country: this.lookup.country,
      flag: this.lookup.country && this.lookup.country.toLowerCase(),
    };
  }

  /**
   * Returns all system properties sent by the client
   */
  public getSystemProperties(): ClientProperties {
    return {
      id: this.id,
      hostname: this.hostname,
      username: this.username,
      monitors: this.monitors,
      os: this.os,
    };
  }

  /**
   * Read n bytes from the socket and resolve when complete
   * @param n
   */
  private async read(n: number) {
    return new Promise<Buffer>((resolve, reject) => {
      const buffer = this.socket.read(n);
      if (buffer === null) {
        this.socket.once('readable', () =>
          this.read(n)
            .then(resolve)
            .catch(reject)
        );
        return;
      }

      resolve(buffer);
    });
  }

  private async loop() {
    while (this.socket.readable) {
      let buffer = await this.read(2);
      const header = buffer.readInt16LE(0);

      buffer = await this.read(4);
      const size = buffer.readInt32LE(0);

      buffer = await this.read(size);
      const data = new BSON().deserialize(buffer);

      this.handle(header, data);
    }
  }

  private handle(header: PacketType, data: any) {
    const handler = selectHandler(header);

    if (handler) {
      handler(data, this);
    } else {
      throw new Error('failed to find handler for ' + header);
    }
  }
}

export default Client;
