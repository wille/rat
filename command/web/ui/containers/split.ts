/// <reference path="containers.ts" />

namespace Web.UI.Containers {

    export class ElementSplitter {

        private instance;

        constructor(private elements: HTMLElement[]) {

        }

        public create() {
            this.instance = Split(this.elements, {
                sizes: [
                    0,
                    100
                ],
                direction: "horizontal",
                minSize: 0
            });
        }

        public destroy() {
            if (!this.instance) {
                throw new Error("splitter not initiated");
            }

            this.instance.destroy();

            // Remove gutters left over by SplitJS
            let gutters = viewContainer.getElementsByClassName("gutter");

            for (let i = 0; i < gutters.length; i++) {
                viewContainer.removeChild(gutters[i]);
            }
        }
    }

    export const viewSplitter = new ElementSplitter([mainViewContainer, subViewContainer]);
}
