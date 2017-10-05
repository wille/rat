class Settings {

    public set(key: string, value: any) {
        Cookies.set(key, value);
    }

    public get(key: string): any {
        return Cookies.get(key);
    }

    get password() {
        return this.get("password");
    }

    set password(password: string) {
        this.set("password", password);
    }

    clearPassword() {
        Cookies.remove("password");
    }
}

const settings = new Settings();