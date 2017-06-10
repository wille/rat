interface Slider {
    new(element: HTMLElement | string, options?: any): Slider;

    getValue(): number;
    
    on(event: string, callback: () => void);
}

declare var Slider: Slider;