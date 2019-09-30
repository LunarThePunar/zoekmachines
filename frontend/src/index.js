import "./index.css";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import React, {Component} from "react";
import ReactDOM from "react-dom"
import Sidebar from "react-sidebar";
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
      selectedOption: null
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.content = this.content.bind(this);
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  content () {
    return (
      <div>
        <h3 className="header">Country</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={options}
          isSearchable={true}
          isMulti={false}
        />
        <h3 className="header">Topics</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={options}
          isSearchable={true}
          isMulti={false}
        />
        <h3 className="header">People</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={options}
          isSearchable={true}
          isMulti={false}
        />
        <h3 className="header">Organisations</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={options}
          isSearchable={true}
          isMulti={false}
        />
        <h3 className="header">Companies</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={options}
          isSearchable={true}
          isMulti={false}
        />
        <h3 className="header">Exchanges</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={options}
          isSearchable={true}
          isMulti={false}
        />
      </div>
    );
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  render() {
    return (
      <Sidebar
        sidebar={this.content()}
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
        styles={{ sidebar: { background: "white", padding: "10px", minWidth: "350px"} }}
      >
      <div class="index">
        <div class="logo">
        </div>
        <div class="query">
          <input class="searchbar" v-model="query"></input>
          <div class="searchbutton">
            <input type="button" value="Search" class="button"></input>
            <input onClick={() => this.onSetSidebarOpen(true)} type="button" value="Advanced Search" class="button"></input>
          </div>
        </div>
      </div>
      </Sidebar>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
