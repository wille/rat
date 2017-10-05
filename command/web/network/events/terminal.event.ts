namespace Web.Network.Events {

    import TerminalView = UI.Views.TerminalView;

    type TerminalParameter = string

    export class TerminalEvent implements IncomingEvent<TerminalParameter> {

        constructor(private view: TerminalView) {

        }

        public emit(data: TerminalParameter) {
            this.view.append(data);
        }
    }
}