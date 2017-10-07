namespace Web.UI.Statusbar {

    const Statusbar = document.getElementById("statusbar") as HTMLDivElement;
    const ConnectionStatusElement = document.getElementById("status");

    /**
     * Creates a status bar separator, should be between each element
     */
    function createSeparator() {
        let element = document.createElement("div") as HTMLDivElement;
        element.className = "separator";
        return element;
    }

    export function setConnectionStatus(connected: boolean) {
        ConnectionStatusElement.innerHTML = connected ? "Connected" : "Lost Connection";
        ConnectionStatusElement.className = connected ? "" : "error";
    }

    /**
     * Adds an element to the statusbar
     * @param element
     */
    export function addElement(element: HTMLElement) {
        Statusbar.appendChild(createSeparator());
        Statusbar.appendChild(element);
    }

    /**
     * Removes element from statusbar and their separator
     * @param element
     */
    export function removeElement(element: HTMLElement) {
        Statusbar.removeChild(element);
        Statusbar.removeChild(Statusbar.childNodes[Statusbar.childNodes.length - 1]);
    }

    export function hide() {
        Statusbar.hidden = true;
    }

    export function show() {
        Statusbar.hidden = false;
    }
}
