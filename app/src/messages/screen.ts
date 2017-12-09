import { Screen } from "@components/screen";
import ScreenFrameTemplate from "@templates/screenFrame";

import MessageHandler from "./index";

export default class ScreenHandler implements MessageHandler<ScreenFrameTemplate> {

    constructor(private view: Screen) {

    }

    public emit(data: ScreenFrameTemplate) {
        const encoded = "data:image/jpeg;base64," + data.data.toString("base64");
        this.view.setState({
           data: encoded
        });
    }
}
