interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Frame {
    handle: number;
    title: string;
    rect: Rect;
}

interface Monitor {
    id?: number;
    x: number;
    y: number;
    width: number;
    height: number;
}