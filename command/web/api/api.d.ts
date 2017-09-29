declare enum OperatingSystemType {
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

interface Client {
    readonly ping: number;
    readonly id: number;
    readonly flag: string;
    readonly country: string;
    readonly host: string;
    readonly computerName: string;
    readonly operatingSystem: OperatingSystem;
    readonly separator: string;

    disconnect();
    shutdown();
    reboot();
    
    getById(id: number): Client | null;
}