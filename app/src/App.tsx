import * as React from "react";

import { Connections } from "./components/clientlist";

class App extends React.Component<any, any> {

    public render() {
        return (
            <Connections client={null} />
        );
    }
}

export default App;
