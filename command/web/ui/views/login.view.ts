/// <reference path="view.ts" />
/// <reference path="../../network/events/login.event.ts" />

namespace Web.UI.Views {

    import Socket = Network.Socket;
    import LoginEvent = Network.Events.LoginEvent;

    export class LoginView extends MainView {

        private passwordElement: HTMLInputElement;
        private submitElement: HTMLButtonElement;
        private statusElement: HTMLParagraphElement;

        constructor() {
            super("login.html", "Login");
        }

        public onEnter() {
            this.passwordElement = <HTMLInputElement>document.getElementById("password");
            this.submitElement = <HTMLButtonElement>document.getElementById("login");
            this.statusElement = <HTMLParagraphElement>document.getElementById("login_status");

            this.submitElement.onclick = () => this.login();

            Web.Network.Events.addEvent(Web.Network.Header.Login, new LoginEvent(this));

            Statusbar.hide();
        }

        public onLeave() {
            Web.Network.Events.removeEvent(Web.Network.Header.Login);
            Statusbar.show();
        }

        public setSuccessful(result: boolean) {
            if (result) {
                this.statusElement.className = "";
                this.statusElement.innerHTML = "Login successful";
            } else {
                this.statusElement.className = "";
                this.statusElement.innerHTML = "Login failed";
            }
        }

        public get password() {
            return this.passwordElement.value;
        }

        private login() {
            console.log("logging in...");
            let password = this.passwordElement.value;

            console.log(this.passwordElement.value);

            Socket.open(password);
        }

        /**
         * LoginView is always shown in full screen, no tabs or other elements visible
         * Restore all elements thats hidden, and set clients view as selected
         */
        public close() {
            Containers.unblockView(this);
        }
    }
}

function setLoginView() {
    Web.UI.Containers.blockView(new Web.UI.Views.LoginView());
}
