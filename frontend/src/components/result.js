import "./result.css";
import React, {Component} from "react";
import Sidebar from "react-sidebar";
import Select from 'react-select';

import ResultBody from "./resultbody"

const axios = require('axios');

export default class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.location.state,
      sidebarOpen: false,
      results: []
    };

    this.body = this.body.bind(this);
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
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
        results: response.data['data']
      })
    })
    .catch(function (error) {
      console.log("ERROR: Could not perform search query");
      console.log(error);
    });
  }

  body() {
    return (
      this.state.results.map(x => <ResultBody title={x.title} summary={x.summary} id={x.id} date={x.date}/>)
    );
  }

  render() {
    return (
        <div>
          <h1>Results</h1>
          <div className="resultList">
           <this.body />
          </div>
        </div>
    );
  }
}
