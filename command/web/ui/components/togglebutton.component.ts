namespace Web.UI.Components {

    /**
     * Toggle button element using Bootstraps button classes
     */
    export class ToggleButton {

        /**
         * Selected classname (blue)
         */
        private static readonly SelectedClassName = "btn btn-primary";

        /**
         * Unselected classname (default, white)
         */
        private static readonly UnselectedClassName = "btn btn-default";

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
                let selected = this.element.className === ToggleButton.SelectedClassName;

                if (selected) {
                    this.element.className = ToggleButton.UnselectedClassName;
                } else {
                    this.element.className = ToggleButton.SelectedClassName;
                }

                callback(selected);
            };
        }
    }
}
