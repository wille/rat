/**
 * Toggle button element using Bootstraps button classes
 */
class ToggleButton {

    /**
     * Selected classname (blue)
     */
    private static readonly SELECTED_CLASSNAME = "btn btn-primary";

    /**
     * Unselected classname (default, white)
     */
    private static readonly UNSELECTED_CLASSNAME = "btn btn-default";

    /**
     * @param element the backing HTML element
     */
    constructor(private element: HTMLElement) {

    }

    /**
     * Set onclick event, toggle classname and call callback function
     * @param callback has one argument, boolean checked
     */
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
