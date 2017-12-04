import * as React from "react";
import { Nav, NavItem } from "react-bootstrap";
import * as SplitPane from "react-split-pane";

import { Connections } from "./components/clientlist";
import ViewController from "./viewController";

class App extends React.Component<any, any> {

    private viewController: ViewController;

    public componentWillMount() {
        this.viewController = new ViewController(this);
    }

    public render() {
        return (
            <div>
                <SplitPane defaultSize="50%" split="vertical">
                    <Connections client={null} viewController={this.viewController} />
                    <div>
                        <Nav bsStyle="tabs" activeKey="1">
                            {this.viewController.views.map((view) => {
                                console.log(view);
                                return (
                                    <NavItem key={view.id} eventKey={view.id} onClick={() => this.viewController.selected = view}>{view.title}</NavItem>
                                );
                            })}
                        </Nav>
                        {this.viewController.selected ? this.viewController.selected.render() : false}
                    </div>
                </SplitPane>
            </div>
        );
    }
}

export default App;
