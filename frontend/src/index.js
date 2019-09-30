import "./index.css";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import React, {Component} from "react";
import ReactDOM from "react-dom"
import Sidebar from "react-sidebar";
import Select from 'react-select';

const axios = require('axios');

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
      selectedOption: null,
      people: [],
      orgs: [],
      places: [],
      topics: [],
      exchanges: [],
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.content = this.content.bind(this);

  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  async loadPeople() {
    try {
      const response = await axios.get("/api/people");
      const values = response.data.map(x => ({value: x, label: x}));
      this.setState({
        people: values
      });
    } catch(error) {
      console.log("ERROR: Failed to update people data.");
      console.log(error);  
    }
  }

  async loadOrgs() {
    try {
      const response = await axios.get("/api/orgs");
      const values = response.data.map(x => ({value: x, label: x}));
      this.setState({
        orgs: values
      });
    } catch(error) {
      console.log("ERROR: Failed to update organisations data.");
      console.log(error);  
    }
  }

  async loadTopics() {
    try {
      const response = await axios.get("/api/topics");
      const values = response.data.map(x => ({value: x, label: x}));
      this.setState({
        topics: values
      });
    } catch(error) {
      console.log("ERROR: Failed to update topics data.");
      console.log(error);  
    }
  }

  async loadPlaces() {
    try {
      const response = await axios.get("/api/places");
      const values = response.data.map(x => ({value: x, label: x}));
      this.setState({
        places: values
      });
    } catch(error) {
      console.log("ERROR: Failed to update places data.");
      console.log(error);  
    }
  }


  async loadExchanges() {
    try {
      const response = await axios.get("/api/exchanges");
      const values = response.data.map(x => ({value: x, label: x}));
      this.setState({
        exchanges: values
      });
    } catch(error) {
      console.log("ERROR: Failed to update exchange data.");
      console.log(error);  
    }
  }



  async componentDidMount() {
    await this.loadPeople();
    await this.loadOrgs();
    await this.loadPlaces();
    await this.loadTopics();
    await this.loadExchanges();
  }

  content () {
    return (
      <div>
        <h3 className="header">Country</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={this.state.places}
          isSearchable={true}
          isMulti={true}
        />
        <h3 className="header">Topics</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={this.state.topics}
          isSearchable={true}
          isMulti={true}
        />
        <h3 className="header">People</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={this.state.people}
          isSearchable={true}
          isMulti={true}
        />
        <h3 className="header">Organisations</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={this.state.orgs}
          isSearchable={true}
          isMulti={true}
        />
        <h3 className="header">Exchanges</h3>
        <Select
          value={this.selectedOption}
          onChange={this.handleChange}
          options={this.state.exchanges}
          isSearchable={true}
          isMulti={true}
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
      <div className="index">
        <div className="logo">
        </div>
        <div className="query">
          <input className="searchbar" v-model="query"></input>
          <div className="searchbutton">
            <input type="button" value="Search" className="button"></input>
            <input onClick={() => this.onSetSidebarOpen(true)} type="button" value="Advanced Search" className="button"></input>
          </div>
        </div>
      </div>
      </Sidebar>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
