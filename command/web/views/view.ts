abstract class AbstractView {

    /**
     * The assigned tab element when opened
     */
    public tab: HTMLElement;
    
    /**
     * The assigned view element when opened
     */
	public viewElement: HTMLElement;

    /**
     * @param filename basename of template file
     * @param _title the desired tab title
     */
	constructor(private filename: string, private _title: string) {

	}

    /**
     * Called when view is opened
     */
    public abstract onEnter();
    
    /**
     * Called when view is closed
     */
	public abstract onLeave();

    /**
     * Returns the element from ID just inside this view
     * @param id 
     */
	public getElementById(id: string): HTMLElement {
		let elements = this.viewElement.getElementsByTagName("*");

		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			if (element.getAttribute("id") === id) {
				return <HTMLElement>element;
			}
		}

		return null;
    }
    
    /**
     * @return the template path
     */
    public get template() {
        return "static/templates/" + this.filename;
    }

    /**
     * @return the tab title
     */
    public get title(): string {
        return this._title
    }

    /**
     * Set the tab title and document title
     */
    public set title(t: string) {
        this._title = t;
        document.title = t;
    }
}

abstract class MainView extends AbstractView {

	constructor(url: string, title: string) {
		super(url, title);
	}

	public abstract onEnter();
	public abstract onLeave();
}

abstract class SubView extends AbstractView {

	constructor(url: string, title: string, public client?: Client) {
		super(url, title);
	}

	public abstract onEnter();
	public abstract onLeave();
}
