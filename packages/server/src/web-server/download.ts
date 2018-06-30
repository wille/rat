import { Request, Response } from 'express';
import * as path from 'path';

import { transfersList } from '../transfers';

export default (req: Request, res: Response) => {
  const id = req.params.id;

  const transfer = transfersList.find(x => x.id.equals(id));

  if (transfer) {
    res.download(transfer.local, path.basename(transfer.remote));
  } else {
    res.sendStatus(404).end();
  }
};
