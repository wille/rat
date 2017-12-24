export interface Monitor {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface OperatingSystem {
    type: "Windows" | "Linux" | "macOS" | "FreeBSD"
          | "OpenBSD" | "DragonFlyBSD" | "NetBSD"
          | "Solaris" | string;
    display: string;
}

/**
 * All system information exposed by a client
 */
export interface ClientProperties {
    id: string;
    host?: string;
    flag?: string;
    country?: string;

    ping?: number;
    username?: string;
    hostname?: string;
    monitors?: Monitor[];
    os?: OperatingSystem;
}
