abstract class ElementWrapper<T extends HTMLElement, K extends keyof HTMLElementTagNameMap> {
    
    protected backing: T;

    constructor(tagName: K) {
        this.backing = document.createElement(tagName) as T;
    }

    public get element() {
        return this.backing;
    }
}