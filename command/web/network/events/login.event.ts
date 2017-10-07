/// <reference path="../socket.ts" />

namespace Web.Network.Events {

    import Socket = Network.Socket;
    import LoginView = UI.Views.LoginView;
    
    interface LoginParameters {
        result: boolean;
    }
    
    export class LoginEvent implements IncomingEvent<LoginParameters> {
    
        constructor(private view: LoginView) {
    
        }
    
        public emit(data: LoginParameters) {
            let authenticated = data.result;
    
            Socket.authenticated = authenticated;
    
            console.log("Authenticated", authenticated);
    
            settings.password = this.view.password;
    
            this.view.setSuccessful(authenticated);
    
            if (authenticated) {
                this.view.close();
            } else {
                settings.clearPassword();
            }
        }
    }
}
