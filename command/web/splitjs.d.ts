interface SplitOptions {
    sizes?: number[];
    minSize?: number | number[];
    gutterSize?, snapOffset?: number;
    direction?: "horizontal" | "vertical";
    cursor?: string;
    onDrag?, onDragStart?, onDragEnd?: () => void;
}

declare function Split(element: HTMLElement[] | string[], options?: SplitOptions);