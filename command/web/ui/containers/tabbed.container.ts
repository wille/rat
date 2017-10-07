namespace Web.UI.Containers {

    import AbstractView = Views.AbstractView;

    export class TabbedContainer<T extends AbstractView> {

        public views: T[] = [];

        constructor(protected container, protected viewElement, protected tabs) { }

        public setActiveView(view: T) {
            for (let subview of this.views) {
                subview.tab.className = "";
                subview.viewElement.hidden = true;
            }

            view.tab.className = "active";
            view.viewElement.hidden = false;
        }

        public closeView(view: T) {
            let index = this.views.indexOf(view);

            // New array since delete keeps indexes
            let temp: T[] = [];
            for (let i = 0; i < this.views.length; i++) {
                if (i !== index) {
                    temp.push(this.views[i]);
                }
            }

            this.views = temp;

            if (view.tab) {
                this.tabs.removeChild(view.tab);
            }
            this.viewElement.removeChild(view.viewElement);

            // Select nearest tab
            if (index === 0 && this.views.length !== 1) {
                index++;
            } else {
                while (index >= 0 && !this.views[index]) {
                    index--;
                }
            }

            if (this.views.length > 0) {
                this.setActiveView(this.views[index]);
            }

            view.onLeave();
        }

        public setView(view: T, onOpen?: () => void) {
            this.views.push(view);

            // Create element for the view and load it
            let viewElement = document.createElement("div");
            $(viewElement).load(view.template, (response, status) => {
                console.log("load", view.template + ":", status);
                view.onEnter();

                if (onOpen) {
                    onOpen();
                }
            });
            view.viewElement = viewElement;

            // Add the view to the subview
            this.viewElement.appendChild(viewElement);

            // Add tab
            this.addTab(view);
        }

        protected isEmpty() {
            return this.views.length === 0;
        }

        private addTab(view: T) {
            let tab = document.createElement("li");
            tab["role"] = "presentation";
            tab.className = "active";

            let a = document.createElement("a");
            a.innerText = view.title;
            a.onclick = () => {
                this.setActiveView(view);
            };
            tab.appendChild(a);

            this.tabs.appendChild(tab);

            view.tab = tab;

            this.setActiveView(view);
        }
    }
}
