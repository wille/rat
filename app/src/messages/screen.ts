import { Screen } from '@components/screen';
import { ScreenFrameTemplate } from '@templates';

import MessageHandler from './index';

export default class ScreenHandler implements MessageHandler<ScreenFrameTemplate> {

  constructor(private view: Screen) {

  }

  public emit(data: ScreenFrameTemplate) {
    this.view.setState({
       data
    });
  }
}
