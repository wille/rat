import { ObjectId } from 'bson';
import * as throttle from 'lodash.throttle';
import ControlSocketServer from 'server/src/control-socket';
import { TransferMessage } from 'server/src/ws/messages';
import AverageCounter from 'shared/average-counter';
import { Recipient, TransferState } from 'shared/templates';
import TransferController from 'shared/transfer-controller';

abstract class ServerTransferController implements TransferController {
  public local: string;
  public remote: string;
  public total: number = 0;
  public recv: number = 0;
  public state: TransferState = TransferState.Waiting;
  public bps = 0;

  protected counter = 0;
  protected averageCounter = new AverageCounter();
  protected readonly update = throttle(() => {
    this.bps = this.counter;
    this.averageCounter.push(this.bps);
    this.counter = 0;
    ControlSocketServer.broadcast(new TransferMessage(this));
  }, 1000);

  constructor(
    public readonly id: ObjectId,
    public readonly recipient: Recipient
  ) {}

  abstract cancel();
  abstract start();
  abstract pause();

  public finish() {
    this.state = TransferState.Complete;
    this.bps = this.averageCounter.calculate();
    this.update();
  }
}

export default ServerTransferController;
