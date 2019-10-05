import { Message } from 'shared/messages';
import {
  ClientProperties,
  Monitor,
  OperatingSystem,
  UserOperatingSystem,
} from 'shared/system';
import { ClientTemplate } from 'app/types';
import ControlSocket from './control';

class Client implements ClientProperties {
  public ping: number;
  public flag: string;
  public country: string;
  public username: string;
  public hostname: string;
  public monitors: Monitor[];
  public os: UserOperatingSystem;

  private updateListeners: Array<() => void> = [];

  constructor(
    public readonly id: number,
    public readonly host: string,
    data?: ClientProperties
  ) {
    if (data) {
      this.update(data);
    }
  }

  public get identifier() {
    return this.username + '@' + this.hostname;
  }

  public get separator() {
    return this.os.type === OperatingSystem.WINDOWS ? '\\' : '/';
  }

  /**
   * Subscribe to data update events
   * @param callback
   * @returns unsubscribe function
   */
  public subscribe(callback: () => void) {
    this.updateListeners.push(callback);

    return () => {
      const index = this.updateListeners.indexOf(callback);
      if (index > -1) {
        this.updateListeners.splice(index, 1);
      }
    };
  }

  public update(properties: ClientProperties) {
    this.ping = properties.ping || this.ping;
    this.flag = properties.flag || this.flag;
    this.country = properties.country || this.country;
    this.username = properties.username || this.username;
    this.hostname = properties.hostname || this.hostname;
    this.monitors = properties.monitors || this.monitors || [];
    this.os = properties.os ||
      this.os || { display: null, type: OperatingSystem.UNKNOWN };

    this.updateListeners.forEach(c => c());
  }

  public send(m: Message) {
    m._id = this.id;
    ControlSocket.send(m);
  }

  public open(path: string) {
    document.location.href = '/view/' + this.id + '/' + path;
  }
}

export default Client;
