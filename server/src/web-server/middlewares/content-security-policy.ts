import { RequestHandler } from 'express';

const csp: RequestHandler = (_, res, next) => {
  res.header(
    'Content-Security-Policy',
    "default-src 'self'; style-src 'unsafe-inline' 'self'; connect-src 'self' wss://*:*; img-src 'self' data:"
  );
  next();
};

export default csp;
