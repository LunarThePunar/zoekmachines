import "./index.css";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import React, {Component} from "react";
import ReactDOM from "react-dom";

import Search from "./components/search";
import Result from "./components/result";


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Search} exact={true} />
          <Route path="/result" component={Result} exact={true} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
