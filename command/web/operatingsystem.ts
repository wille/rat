namespace Web {
    export enum OperatingSystemType {
        Windows,
        macOS,
        Linux,
        FreeBSD,
        OpenBSD,
        DragonflyBSD,
        NetBSD,
        Solaris
    }

    export interface OperatingSystem {
        readonly type: OperatingSystemType;
        readonly display: string;
    }
}
