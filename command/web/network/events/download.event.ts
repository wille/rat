namespace Web.Network.Events {

    interface DownloadParameters {
        key: string;
    }

    export class DownloadEvent implements IncomingEvent<DownloadParameters> {

        public emit(data: DownloadParameters) {
            document.location.href = "/download?key=" + data.key;
        }
    }
}
