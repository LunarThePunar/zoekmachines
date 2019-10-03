import "./result.css";
import "./resultHeader.css";
import React, {Component} from "react";
import ReactWordcloud from 'react-wordcloud';

import ResultBody from "./resultbody"

import logo from '../resources/reutel_logo.png';

import LineChart from "./chart";

import Collapsible from 'react-collapsible';

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
      datapoints: [],
      wordcloud: [],
      places_facets: [],
      people_facets: [],
      topics_facets: [],
      exchanges_facets: [],
      orgs_facets: [],
      companies_facets: []
    };

    this.body = this.body.bind(this);
    this.header = this.header.bind(this);
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.content = this.content.bind(this);
    this.facet_people = this.facet_people.bind(this);
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
        query: this.state.payload.query,
        wordcloud: response.data['wordcloud'],
        people_facets: response.data['facets']['people'],
        places_facets: response.data['facets']['places'],
        topics_facets: response.data['facets']['topics'],
        orgs_facets: response.data['facets']['orgs'],
        companies_facets: response.data['facets']['companies'],
        exchanges_facets: response.data['facets']['exchanges'],
      })
    })
    .catch(function (error) {
      console.log("ERROR: Could not perform search query");
      console.log(error);
    });
  }

  body() {
    const options = {
      colors: ['rgb(40, 82, 233)', 'rgb(244, 161, 15)', 'rgb(215, 21, 31)', 'rgb(39, 142, 50)'],
      enableTooltip: true,
      deterministic: true,
      fontFamily: 'sans-serif',
      fontSizes: [20, 100],
      rotations: 0,
      rotationAngles: [0],
      fontStyle: 'normal',
      fontWeight: 'bold',
      transitionDuration: 300,
      transition: false
    };
    return (
      <div className="resultList">
        <div className="wordCloud">
        <ReactWordcloud options={options} words={this.state.wordcloud} />
        </div>
        {this.state.results.map(x => <ResultBody title={x.title} summary={x.summary} id={x.id} date={x.date}/>)}
      </div>
    );
  }

  facet_people (facet_list) {
    return (
      <div>
        <Collapsible trigger={<h2 className="facetTitle">People</h2>}>
          {facet_list.map(x => <div className={this.state.selectedPeople.includes(x.name) ? "facetNameActive" : "facetName"} 
                                    onClick={async () => {
                                        this.setState({
                                            selectedPeople: [x.name]
                                        });
                                        await this.search();
                                    }
                                            }>
            {x.name} ({x.count})
          </div>)}
        </Collapsible>
      </div>
    )
  }

  facet_places (facet_list) {
    return (
      <div>
        <Collapsible trigger={<h2 className="facetTitle">Places</h2>}>
          {facet_list.map(x => <div className={this.state.selectedPlaces.includes(x.name) ? "facetNameActive" : "facetName"} 
                                    onClick={async () => {
                                        this.setState({
                                            selectedPlaces: [x.name]
                                        });
                                        await this.search();
                                    }
                                            }>
            {x.name} ({x.count})
          </div>)}
        </Collapsible>
      </div>
    )
  }

  facet_orgs (facet_list) {
    return (
      <div>
        <Collapsible trigger={<h2 className="facetTitle">Organisations</h2>}>
          {facet_list.map(x => <div className={this.state.selectedOrgs.includes(x.name) ? "facetNameActive" : "facetName"} 
                                    onClick={async () => {
                                        this.setState({
                                            selectedOrgs: [x.name]
                                        });
                                        await this.search();
                                    }
                                            }>
            {x.name} ({x.count})
          </div>)}
        </Collapsible>
      </div>
    )
  }

  facet_exchanges (facet_list) {
    return (
      <div>
        <Collapsible trigger={<h2 className="facetTitle">Exchanges</h2>}>
          {facet_list.map(x => <div className={this.state.selectedExchanges.includes(x.name) ? "facetNameActive" : "facetName"} 
                                    onClick={async () => {
                                        this.setState({
                                            selectedExchanges: [x.name]
                                        });
                                        await this.search();
                                    }
                                            }>
            {x.name} ({x.count})
          </div>)}
        </Collapsible>
      </div>
    )
  }

  facet_topics (facet_list) {
    return (
      <div>
        <Collapsible trigger={<h2 className="facetTitle">Topics</h2>}>
          {facet_list.map(x => <div className={this.state.selectedTopics.includes(x.name) ? "facetNameActive" : "facetName"} 
                                    onClick={async () => {
                                        this.setState({
                                            selectedTopics: [x.name]
                                        });
                                        await this.search();
                                    }
                                            }>
            {x.name} ({x.count})
          </div>)}
        </Collapsible>
      </div>
    )
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
              Trends
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
        });
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
        <div className="chart">
          <LineChart datapoints = {this.state.datapoints}/>
        </div>
      </div>
    );
  }

  render() {
    return (
        <div>
          <this.header />
          <div className="facets">
          {this.facet_topics(this.state.topics_facets)}
          {this.facet_places(this.state.places_facets)}
          {this.facet_orgs(this.state.orgs_facets)}
          {this.facet_exchanges( this.state.exchanges_facets)}
          {this.facet_people( this.state.people_facets)}
          </div>
          {this.state.showResults ? this.body() : <this.content />}
        </div>
    );
  }
}
