abstract class Menu {

    private instance: HTMLElement;
    
    constructor(protected text: string) {

    }

    /**
     * Creates the raw HTML element
     */
    protected abstract createElement(): HTMLElement;

    public get element() {
        if (!this.instance) {
            this.instance = this.createElement();
        }

        return this.instance;
    }

    public set enabled(b: boolean) {
        this.element.className = b ? "disabled" : "";
    }

    public get enabled() {
        return this.instance.className === "disabled";
    }
}

/**
 * A normal single click menu item
 */
class MenuItem extends Menu {

    constructor(text: string) {
        super(text);
    }

    public createElement() {
        let li = document.createElement("li");

        let text = document.createElement("a");
        text.innerText =  this.text;
        li.appendChild(text);

        li.onclick = () => {
            this.onclick();
        }

        return li;
    }

    public onclick: () => void;
}

/**
 * A submenu that holds multiple menuitems
 */
class SubMenu extends Menu {

    /**
     * The HTML element which holds the subitems
     */
    private elementsList: HTMLElement;

    constructor(text: string, items?: MenuItem[]) {
        super(text);

        if (items) {
            for (let item of items) {
                this.addItem(item);   
            }
        }
    }

    /**
     * Add a menu item to this submenu
     */
    public addItem(item: MenuItem) {
        this.element;
        this.elementsList.appendChild(item.createElement());
    }

    public addItems(...item: MenuItem[]) {
        item.forEach((x) => this.addItem(x));
    }

    public createElement() {
        // Main submenu element
        let li = document.createElement("li");
        li.className = "dropdown-submenu";

        // Main menu element of submenu
        let a = document.createElement("a");
        a.innerText = this.text;

        a.onmouseover = () => $(a).next("ul").show();
		a.onmouseleave = (event: MouseEvent) => {
			let target = event.toElement;

			if (target.parentElement.parentElement.className !== "dropdown-menu") {
				$(a).next("ul").hide();
			}
		}     

        // Caret icon
        let caret = document.createElement("span");
        caret.className = "caret";
        a.appendChild(caret);
        li.appendChild(a);

        this.elementsList = document.createElement("ul");
        this.elementsList.className = "dropdown-menu";
        li.appendChild(this.elementsList);

        return li;
    }
}

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
    
    public add(s: Menu) {
        this.menu.children[0].appendChild(s.element);
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
