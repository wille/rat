enum OperatingSystemType {
    Windows,
    MacOS,
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