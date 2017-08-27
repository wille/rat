abstract class ContextMenu {

	/**
	 * Context menu source is to be defined in the HTML document
	 * @param parent is the element which will have the menu
	 * @param menu is the menu element
	 */
    constructor(private parent: HTMLElement, private menu: HTMLElement) { }

	/**
	 * Initializes this context menu
	 */
    public hook() {
		$(this.parent).on("contextmenu", (event) => {
			document.onclick = () => this.destroy();

			$(this.menu).css({
				display: "block",
				left: event.pageX,
				top: event.pageY
			});

			this.onOpen();

			event.preventDefault();
		});
    }

	/**
	 * Destroys this context menu
	 */
    private destroy() {
        document.onclick = undefined;
        $(this.menu).hide();
        this.onClose();
    }

    protected onOpen() {

    }

    protected onClose() {

	}
	
	/**
	 * Creates a submenu
	 * @param element 
	 */
	public static createSubMenu(element: HTMLElement) {
		element.onmouseover = () => $(element).next("ul").show();
		element.onmouseleave = (event: MouseEvent) => {
			let target = event.toElement;

			if (target.parentElement.parentElement.className !== "dropdown-menu") {
				$(element).next("ul").hide();
			}
		}
	}
}
