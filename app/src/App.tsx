import ViewController from "@app/viewController";
import TabbedView from "@components/tabs/TabPage";
import * as React from "react";
import { Nav, NavItem } from "react-bootstrap";
import * as SplitPane from "react-split-pane";

import { Connections } from "./components/clientlist";

interface State {
    views: TabbedView[];
    selected: TabbedView;
}

class App extends React.Component<any, State> {

    public state: State = {
        views: [],
        selected: null
    };

    private viewController: ViewController;

    public componentWillMount() {
        this.viewController = new ViewController(this);
    }

    public render() {
        const { views, selected } = this.state;

        return (
            <div>
                <SplitPane defaultSize="50%" split="vertical">
                    <Connections client={null} viewController={this.viewController} />
                    <div>
                        <Nav bsStyle="tabs" activeKey={selected} onSelect={(key) => this.handleSelect(key as any as TabbedView)}>
                            {views.map((view) => {
                                return (
                                    <NavItem key={view.id} eventKey={view}>{view.title}</NavItem>
                                );
                            })}
                        </Nav>
                        {selected ? selected.render() : false}
                    </div>
                </SplitPane>
            </div>
        );
    }

    private handleSelect(key: TabbedView) {
        console.log(key);
        this.setState({
            selected: key
        });
    }
}

export default App;
