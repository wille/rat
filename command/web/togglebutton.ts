class ToggleButton {

    private static readonly SELECTED_CLASSNAME = "btn btn-primary";
    private static readonly UNSELECTED_CLASSNAME = "btn btn-default";

    constructor(private element: HTMLElement) {

    }

    public set onclick(callback: (checked: boolean) => void) {
        this.element.onclick = () => {
            let selected = this.element.className === ToggleButton.SELECTED_CLASSNAME;

            if (selected) {
                this.element.className = ToggleButton.UNSELECTED_CLASSNAME;
            } else {
                this.element.className = ToggleButton.SELECTED_CLASSNAME;
            }

            callback(selected);
        };
    }
}
