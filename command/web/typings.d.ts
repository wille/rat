// jQuery
declare var $;

// Current page client ID defined in HTML
declare var id: number;

// Split.js
declare var Split;

// js-cookie
declare var Cookies;

// Bootstrap slider
declare class Slider {
    constructor (element: HTMLElement | string, options?: any);

    getValue(): number;

    on(event: string, callback: () => void);
}