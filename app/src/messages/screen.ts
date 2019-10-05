import { MessageType } from 'app/messages/types';
import { createMessage } from 'app/types/messages';
import { Binary } from 'bson';

export interface ScreenTemplate {
  active: boolean;
  scale?: number;
  monitor?: true;
  id?: number;
}

export interface ScreenChunkTemplate {
  buffer: Binary;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const StreamMessage = createMessage<ScreenTemplate>(MessageType.Screen);
