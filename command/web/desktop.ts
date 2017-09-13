interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Frame {
    handle: number;
    title: string;
    rect: Rect;
    visible: boolean;
}

interface Monitor {
    id?: number;
    x: number;
    y: number;
    width: number;
    height: number;
}