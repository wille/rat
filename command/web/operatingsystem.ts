enum OperatingSystemType {
    Windows,
    macOS,
    Linux,
    FreeBSD,
    OpenBSD,
    DragonflyBSD,
    NetBSD,
    Solaris
}

interface OperatingSystem {
    readonly type: OperatingSystemType;
    readonly display: string;
}