interface CookieAttributes {
    expires?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
}

interface Cookies {
    set(key: string, value: string, attributes?: CookieAttributes): void;
    get(key: string): string;
    remove(key: string, attributes?: CookieAttributes): void;
}

declare var Cookies: Cookies;