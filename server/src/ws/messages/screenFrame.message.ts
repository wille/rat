import Message from '../../../../shared/src/messages/index';
import { ScreenFrameTemplate } from '../../../../shared/src/templates';
import { MessageType } from '../../../../shared/src/types';

export default class ScreenFrameMessage extends Message<ScreenFrameTemplate> {

  constructor(message: ScreenFrameTemplate) {
    super(MessageType.Screen, message);
  }
}
