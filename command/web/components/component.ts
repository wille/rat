/**
 * Custom HTML component
 */
abstract class Component<K extends keyof HTMLElementTagNameMap> {
    
    /**
     * The backing element
     */
    protected backing: HTMLElementTagNameMap[K];

    /**
     * @param tagName HTML tag
     */
    constructor(tagName: K) {
        this.backing = document.createElement(tagName) as HTMLElementTagNameMap[K];
    }

    public get element() {
        return this.backing;
    }
}