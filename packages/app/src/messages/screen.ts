import { Binary } from 'bson';
import { createMessage } from 'shared/messages';
import { MessageType } from 'shared/types';

export interface ScreenTemplate {
  active: boolean;
  scale?: number;
  monitor?: true;
  handle?: number;
}

export interface ScreenChunkTemplate {
  buffer: Binary;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const StreamMessage = createMessage<ScreenTemplate>(MessageType.Screen);
