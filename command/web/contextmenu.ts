class ContextMenu {

	/**
	 * Context menu source is to be defined in the HTML document
	 * @param parent is the element which will have the menu
	 * @param menu is the menu element
	 */
    constructor(private parent: HTMLElement, private menu: HTMLElement) { }

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

    private destroy() {
        document.onclick = undefined;
        $(this.menu).hide();
        this.onClose();
    }

    protected onOpen() {

    }

    protected onClose() {

    }
}
