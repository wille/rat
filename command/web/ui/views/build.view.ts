/// <reference path="view.ts" />
/// <reference path="../../network/socket.ts" />
/// <reference path="../../network/events/download.event.ts" />
/// <reference path="../../network/messages/build.message.ts" />

namespace Web.UI.Views {

    import Event = Network.Events;
    import DownloadEvent = Network.Events.DownloadEvent;
    import BuildMessage = Network.Messages.BuildMessage;
    import BuildMessageParameters = Network.Messages.BuildMessageParameters;
    import Win32Manifest = Network.Messages.Win32Manifest;

    export class BuildView extends SubView {

        private iconPreviewElement: HTMLImageElement;
        private iconElement: HTMLInputElement;
        private iconData: ArrayBuffer;

        constructor() {
            super("build.html", "Build");
        }

        public onEnter() {
            let button = document.getElementById("submit") as HTMLButtonElement;
            button.onclick = () => this.build();

            let osElement = document.getElementById("os") as HTMLSelectElement;
            osElement.onchange = (event) => {
                let manifestDiv = document.getElementById("manifest") as HTMLDivElement;
                let os = (osElement.options[osElement.selectedIndex] as HTMLOptionElement).value;

                manifestDiv.hidden = !(os === "all" || os === "windows");

                let x86 = document.getElementById("386") as HTMLOptionElement;
                x86.disabled = os === "macos";
            };

            this.iconPreviewElement = document.getElementById("icon_preview") as HTMLImageElement;

            this.iconElement = document.getElementById("icon") as HTMLInputElement;
            this.iconElement.onchange = () => this.updateIcon();

            Event.addEvent(Web.Network.Header.Download, new DownloadEvent());
        }

        public onLeave() {
            Event.removeEvent(Web.Network.Header.Download);
        }

        private get name() {
            let element = document.getElementById("name") as HTMLInputElement;
            return element.value === "" ? element.placeholder : element.value;
        }

        private get host() {
            let element = document.getElementById("host") as HTMLInputElement;
            return element.value === "" ? element.placeholder : element.value;
        }

        private get os() {
            let element = document.getElementById("os") as HTMLSelectElement;
            let option = element.options[element.selectedIndex] as HTMLOptionElement;
            return option.value;
        }

        private get arch() {
            let element = document.getElementById("arch") as HTMLSelectElement;
            let option = element.options[element.selectedIndex] as HTMLOptionElement;
            return option.value;
        }

        private get delay(): number {
            let element = document.getElementById("delay") as HTMLInputElement;
            return Number(element.value);
        }

        private get invalidCerts(): boolean {
            let element = document.getElementById("invalidssl") as HTMLInputElement;
            return element.checked;
        }

        private get installPath(): number {
            let elements = document.getElementsByName("path");

            for (let i = 0; i < elements.length; i++) {
                let element = elements[i] as HTMLInputElement;

                if (element.checked) {
                    return Number(element.value);
                }
            }

            return 0;
        }

        private updateIcon() {
            this.iconPreviewElement.src = URL.createObjectURL(this.iconElement.files[0]);

            let file = this.iconElement.files[0];
            let reader = new FileReader();

            reader.onload = (e: any) => {
                this.iconData = e.target.result;
            };

            reader.readAsArrayBuffer(file);
        }

        private get icon() {
            if (this.iconData) {
                return btoa(String.fromCharCode.apply(null, new Uint8Array(this.iconData)));
            }

            return null;
        }

        private get version(): string {
            let element = document.getElementById("version") as HTMLInputElement;
            return element.value === "" ? element.placeholder : element.value;
        }

        private build() {
            let os = this.os;

            let params: BuildMessageParameters = {
                host: this.host,
                os,
                arch: this.arch,
                delay: this.delay,
                name: this.name,
                installPath: this.installPath,
                invalidCertificates: this.invalidCerts
            };

            if (os === "all" || os === "windows") {
                let manifest: Win32Manifest = {
                    version: this.version,
                    icon: this.icon
                };

                params.manifest = manifest;
            }

            Network.Socket.send(new BuildMessage(params));
        }
    }
}
