import { TransferData } from 'shared/templates';

export default interface TransferController extends TransferData {
  cancel();
  pause();
  start();
}
