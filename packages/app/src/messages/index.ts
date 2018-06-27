import { MessageTemplate } from 'shared/templates';

export { default as clientHandler } from './client-handler';
export { default as directoryHandler } from './directory-handler';
export { default as processHandler } from './process-handler';
export { default as screenHandler } from './screen-handler';
export { default as transfersHandler } from './transfer-handler';

export * from './outgoing-messages';

/**
 * Incoming websocket message handler
 */
export type MessageHandler = <T extends MessageTemplate>(data: T) => void;
