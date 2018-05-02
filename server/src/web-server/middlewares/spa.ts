import { RequestHandler } from 'express';
import * as path from 'path';

/**
 * redirects requests to missing files to index.html
 * to allow routing
 */
const spa: RequestHandler = (_, res) =>
  res.sendFile(path.resolve(__dirname, 'app', 'index.html'));

export default spa;
