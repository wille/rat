namespace sample {

    import Client = Web.Client;
    import MainViewContainer = Web.UI.Containers.MainViewContainer;

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
            new Client(id++, randomIp(), "gb", "Great Britain", "test@test", "Linux", "Ubuntu Linux"),
            new Client(id++, randomIp(), "us", "United States", "test@test", "macOS", "macOS 10.12"),
            new Client(id++, randomIp(), "nl", "Netherlands", "DOMAIN\\test", "Windows", "Windows 10"),
            new Client(id++, randomIp(), "gb", "Great Britain", "test@test", "Linux", "Debian 8.0"),
            new Client(id++, randomIp(), "gb", "Great Britain", "test@test", "Linux", "Arch Linux"),
        ]

        for (let client of clients) {
            client.ping = randomPing();
            MainViewContainer.clientsView.add(client);
        }
    }
}
