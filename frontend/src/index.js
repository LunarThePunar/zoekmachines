import "./index.css";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import React, {Component} from "react";
import ReactDOM from "react-dom";

import Search from "./components/search";
import Result from "./components/results/result";
import Article from "./components/article";


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Search} exact={true} />
          <Route path="/result" component={Result} exact={true} />
          <Route path="/article/:id" component={Article} exact={true} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
