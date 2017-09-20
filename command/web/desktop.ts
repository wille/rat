/// <reference path="operatingsystem.ts" />

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

namespace Desktop {

    /**
     * Disallowed window titles on specific operating systems,
     * windows that have no meaning or always exists
     */
    let titles = [];

    titles[OperatingSystemType.Windows] = [
        "Program Manager",
        "Default IME",
        "MSCTFIME UI"
    ]

    titles[OperatingSystemType.macOS] = [
        "Dock - Dock"
    ]

    /**
     * Checks if we should care about this frame at all, removes common OS elements etc
     * @param os operating system type from origin machine of frame
     * @param frame frame to check
     */
    export function displayFrame(os: OperatingSystemType, frame: Frame): boolean {
        let disallowed = titles[os];
        
        if (disallowed) {
            for (let title of disallowed) {
                if (title === frame.title) {
                    return false;
                }
            }
        }

        return frame.title && frame.title.length > 0;
    }
}

interface Monitor {
    id?: number;
    x: number;
    y: number;
    width: number;
    height: number;
}