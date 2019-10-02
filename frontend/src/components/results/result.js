import "./result.css";
import "./resultHeader.css";
import React, {Component} from "react";
import Select from 'react-select';

import ResultBody from "./resultbody"

import logo from '../resources/reutel_logo.png';

import LineChart from "./chart";

const axios = require('axios');

export default class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.location.state,
      sidebarOpen: false,
      results: [],
      showResults: true,
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
      datapoints: []
    };

    this.body = this.body.bind(this);
    this.header = this.header.bind(this);
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.selectPlaces = this.selectPlaces.bind(this);
    this.content = this.content.bind(this);
  }

  handleQuery = query => {
    this.setState( {
      query: query.target.value
    })
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.search();
    }
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

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  async componentDidMount() {
    axios.post('/api/search', this.state.payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      console.log(response);
      this.setState({
        results: response.data['data'],
        datapoints: response.data['chart'],
        query: this.state.payload.query
      })
    })
    .catch(function (error) {
      console.log("ERROR: Could not perform search query");
      console.log(error);
    });

    await this.loadPeople();
    await this.loadOrgs();
    await this.loadPlaces();
    await this.loadTopics();
    await this.loadExchanges();
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
      selectPlaces: arr
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

  body() {
    return (
      this.state.results.map(x => <ResultBody title={x.title} summary={x.summary} id={x.id} date={x.date}/>)
    );
  }

  header() {
    return(
      <div>
        <div className="navBar">
          <div >
            <div className="logo">
              <a className="logoImageRef"  href="/"><img className="logoImage" src={logo} alt="Google" height="40" width="140" data-atf="1"></img></a>
            </div>
            <input className="searchbar" value={this.state.query} onChange={this.handleQuery} onKeyPress={this.handleKeyPress} />
          </div>
          <div className="optionsBar">
            <div onClick={() => this.setState({
                  showResults: true,
                })} className={this.state.showResults ? 'resultButtonSelected': 'resultButton'}>
              Results
            </div>

            <div onClick={() => this.setState({
                  showResults:false
                })} className={!this.state.showResults ? 'resultButtonSelected': 'resultButton'}>
              Advanced
            </div>

          </div>
        </div>
      </div>
    )
  }

  async search() {
    const payload = {
      query: this.state.query,
      places: this.state.selectedPlaces,
      people: this.state.selectedPeople,
      orgs: this.state.selectedOrgs,
      exchanges: this.state.selectedExchanges,
      topics: this.state.selectedTopics
    }

    axios.post('/api/search', payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then((response) => {
        this.setState({
          results: response.data['data'],
          datapoints: response.data['chart'],
          showResults: true
        });
        console.log(this.state);
        this.forceUpdate();
      })
      .catch(function (error) {
        console.log("ERROR: Could not perform search query");
        console.log(error);
      });
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
      </div>
    );
  }

  render() {

    return (
        <div>
          {/* <ResultHeader data={this.state}/> */}
          <this.header />

          <div className="resultList">
           {this.state.showResults ? this.body() : <this.content />}
          </div>
          <div className="chart">
          <LineChart datapoints = {this.state.datapoints}/>
          </div>
        </div>
    );
  }
}
