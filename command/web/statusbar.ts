namespace Statusbar {

    const statusbar = <HTMLDivElement>document.getElementById("statusbar");

    /**
     * Creates a status bar separator, should be between each element
     */
    function createSeparator() {
        let element = <HTMLDivElement>document.createElement("div");
        element.className = "separator";
        return element;
    }

    /**
     * Adds an element to the statusbar
     * @param element
     */
    export function addElement(element: HTMLElement) {
        statusbar.appendChild(createSeparator());
        statusbar.appendChild(element);
    }

    /**
     * Removes element from statusbar and their separator
     * @param element 
     */
    export function removeElement(element: HTMLElement) {
        statusbar.removeChild(element);
        statusbar.removeChild(statusbar.childNodes[statusbar.childNodes.length - 1]);
    }

    export function hide() {
        statusbar.hidden = true;
    }

    export function show() {
        statusbar.hidden = false;
    }
}
