export interface Monitor {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
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
}
