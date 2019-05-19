export interface Monitor {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum OperatingSystem {
  WINDOWS = 'Windows',
  LINUX = 'Linux',
  MAC_OS = 'macOS',
  FREEBSD = 'FreeBSD',
  OPENBSD = 'OpenBSD',
  DRAGONFLYBSD = 'DragonflyBSD',
  NETBSD = 'NetBSD',
  SOLARIS = 'Solaris',
  UNKNOWN = 'Unknown',
}

export interface UserOperatingSystem {
  type: OperatingSystem;
  display: string;
}

/**
 * All system information exposed by a client
 */
export interface ClientProperties {
  id: number;
  host?: string;
  flag?: string;
  country?: string;

  ping?: number;
  username?: string;
  hostname?: string;
  monitors?: Monitor[];
  os?: UserOperatingSystem;
}
