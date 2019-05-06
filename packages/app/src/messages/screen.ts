import { createMessage } from 'shared/messages';
import { MessageType } from 'shared/types';

export interface ScreenTemplate {
  active: boolean;
  scale?: number;
  monitor?: true;
  handle?: number;
}

export const StreamMessage = createMessage<ScreenTemplate>(MessageType.Screen);
