namespace Web.Network.Events {

    interface AutoLoginParameters {
        result: boolean;
    }
    
    export class AutoLoginEvent implements IncomingEvent<AutoLoginParameters> {
    
        public emit(data: AutoLoginParameters) {
            let authenticated = data.result;
    
            removeEvent(Web.Network.Header.Login);
    
            if (authenticated) {
                console.log("logged in successfully");
            } else {
                console.log("failed to login");
                settings.clearPassword();
                setLoginView();
            }
        }
    }
}
