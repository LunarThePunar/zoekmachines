import "./search.css";
import React, {Component} from "react";
import Sidebar from "react-sidebar";
import Select from 'react-select';

import Reutle from './resources/reutel_logo.png'

const axios = require('axios');

export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
      people: [],
      orgs: [],
      places: [],
      topics: [],
      exchanges: [],
      selectedPeople: [],
      selectedOrgs: [],
      selectedPlaces: [],
      selectedTopics: [],
      selectedExchanges: [],
      query: ""
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.content = this.content.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleQuery = query => {
    this.setState( {
      query: query.target.value
    })
  }

  selectPeople = option => {
    var arr = [];
    if (option) {
      option.forEach(item => arr.push(item["value"]));
    }

    this.setState({
      selectedPeople: arr
    });
  }

  selectOrgs = option => {
    var arr = [];
    if (option) {
      option.forEach(item => arr.push(item["value"]));
    }

    this.setState({
      selectedOrgs: arr
    });
  }

  selectTopics = option => {
    var arr = [];
    if (option) {
      option.forEach(item => arr.push(item["value"]));
    }

    this.setState({
      selectedTopics: arr
    });
  }

  selectPlaces = option => {
    var arr = [];
    if (option) {
      option.forEach(item => arr.push(item["value"]));
    }

    this.setState({
      selectedPlaces: arr
    });
  }

  selectExchanges = option => {
    var arr = [];
    if (option) {
      option.forEach(item => arr.push(item["value"]));
    }

    this.setState({
      selectedExchanges: arr
    });
  }

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


  search() {
    const payload = {
      query: this.state.query,
      places: this.state.selectedPlaces,
      people: this.state.selectedPeople,
      orgs: this.state.selectedOrgs,
      exchanges: this.state.selectedExchanges,
      topics: this.state.selectedTopics
    }

    this.props.history.push( 
      {
        pathname: '/result',
        state: {
          payload
        }
      } 
    );
  }

  content () {
    return (
      <div>
        <h3 className="header">Country</h3>
        <Select
          value={this.selectedOption}
          onChange={this.selectPlaces}
          options={this.state.places}
          isSearchable={true}
          isMulti={true}
        />
        <h3 className="header">Topics</h3>
        <Select
          value={this.selectedOption}
          onChange={this.selectTopics}
          options={this.state.topics}
          isSearchable={true}
          isMulti={true}
        />
        <h3 className="header">People</h3>
        <Select
          value={this.selectedOption}
          onChange={this.selectPeople}
          options={this.state.people}
          isSearchable={true}
          isMulti={true}
        />
        <h3 className="header">Organisations</h3>
        <Select
          value={this.selectedOption}
          onChange={this.selectOrgs}
          options={this.state.orgs}
          isSearchable={true}
          isMulti={true}
        />
        <h3 className="header">Exchanges</h3>
        <Select
          value={this.selectedOption}
          onChange={this.selectExchanges}
          options={this.state.exchanges}
          isSearchable={true}
          isMulti={true}
        />
        <input onClick={() => this.search()} type="button" value="Search" className="button"></input>
      </div>
    );
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.search();
    }
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
        <div className="logoMain">
          <img className="logo__image" alt="Reutle" src={Reutle}></img>
        </div>
        <div className="query">
          <form>
          <input className="searchbarIndex" type="text" value={this.state.query} defaultValue={this.state.query} onChange={this.handleQuery} onKeyPress={this.handleKeyPress}></input>
          <div className="searchbutton">
            <input onClick={() => this.search()} type="button" value="Search" className="button"></input>
            <input onClick={() => this.onSetSidebarOpen(true)} type="button" value="Advanced Search" className="button"></input>
          </div>
          </form>
        </div>
      </div>
      </Sidebar>
    );
  }
}
