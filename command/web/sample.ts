namespace Sample {

    function randomPing(): number {
        return Math.floor(Math.random() * 500);
    }

    function randomIp(): string {
        let b = () => {
            return Math.round(Math.random() * 256);
        };

        return b() + "." + b() + "." + b() + "." + b();
    }

    export function run() {
        let id = 0;

        let clients = [
           /*  new Client(id++, { ping: randomPing(), host: randomIp(), flag: "gb", country: "Great Britain", computerName: "test@test", operatingSystem: "Ubuntu Linux" } as ClientFields),
            new Client(id++, { ping: randomPing(), host: randomIp(), flag: "us", country: "United States", computerName: "test@test", operatingSystem: "macOS 10.12" } as ClientFields),
            new Client(id++, { ping: randomPing(), host: randomIp(), flag: "nl", country: "Netherlands", computerName: "DOMAIN\\test", operatingSystem: "Windows 10" } as ClientFields),
            new Client(id++, { ping: randomPing(), host: randomIp(), flag: "gb", country: "Great Britain", computerName: "test@test", operatingSystem: "Debian 8.0" } as ClientFields),
            new Client(id++, { ping: randomPing(), host: randomIp(), flag: "gb", country: "Great Britain", computerName: "test@test", operatingSystem: "Arch Linux" } as ClientFields),
         */]

        for (let client of clients) {
            MainViewContainer.clientsView.add(client);
        }
    }
}

function sample() {
    Sample.run();
}