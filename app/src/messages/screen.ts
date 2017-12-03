import { ScreenTemplate } from "../../../shared/src/messages/screen";
import { Screen } from "../components/screen";
import MessageHandler from "./index";

export default class ScreenHandler implements MessageHandler<ScreenTemplate> {

    constructor(private view: Screen) {

    }

    public emit(data: ScreenTemplate) {
        console.log("frame", data);
    }
}
