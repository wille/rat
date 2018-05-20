import { DataTemplate } from 'shared/templates';
import { createTransfer } from '~/transfers';

export default (data: DataTemplate) => {
  const transfer = createTransfer(data.file);

  console.log('writing file data', data.data);

  transfer.write(data.data.buffer);

  if (data.final) {
    transfer.close();
  }
};
