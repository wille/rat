import { createMessage } from 'shared/messages';
import { MessageType } from 'shared/types';

export enum ShellAction {
  Start = 0,
  Stop = 1,
  Write = 2,
}

export interface ShellMessageTemplate {
  /**
   * command action
   */
  action: ShellAction;

  /**
   * command payload
   */
  data?: string;
}

export const ShellMessage = createMessage<ShellMessageTemplate>(
  MessageType.Shell
);
