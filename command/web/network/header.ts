namespace Web.Network {

    /**
     * WebSocket message headers
     */
    export const enum Header {
        ClientUpdate = 1,
        System = 2,
        Directory = 3, // directory.event.ts
        Download = 4, // download.event.ts
        FileTransfers = 5,
        DownloadProgress = 6,
        Screen = 7, // screen.event.ts
        Process = 8, // process.event.ts
        Monitor = 9, // monitor.event.ts
        MouseMove = 10,
        MouseInput = 11,
        Key = 12,
        Build = 13,
        Shell = 14,
        File = 15,
        Exit = 16,
        Login = 17, // login.event.ts
        Windows = 18
    }
}
