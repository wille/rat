/// <reference path="network/events/login.event.ts" />
/// <reference path="network/events/autologin.event.ts" />

/// <reference path="ui/containers/containers.ts" />
/// <reference path="ui/containers/mainview.container.ts" />
/// <reference path="ui/containers/subview.container.ts" />

/// <reference path="ui/views/login.view.ts" />

/// <reference path="network/events/autologin.event.ts" />

/// <reference path="settings.ts" />

namespace Web {

    import Socket = Network.Socket;
    import addEvent = Network.Events.addEvent;
    import AutoLoginEvent = Network.Events.AutoLoginEvent;
    
    function autoLogin() {
        addEvent(Web.Network.Header.Login, new AutoLoginEvent());
    
        Socket.open(settings.password);
        console.log("auto logging in with", "'" + settings.password + "'");
    }
    
    if (document.cookie.indexOf("password=") !== -1) {
        autoLogin();
    } else {
        setLoginView();
    }
}
    
function logout() {
    settings.clearPassword();
    setLoginView();
}
