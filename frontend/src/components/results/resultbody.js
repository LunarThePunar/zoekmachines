import "./resultbody.css";

import React, {Component} from "react";

export default class ResultBody extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.id)
        this.state = {
            id: 0
        };
      }
    
    componentDidMount() {
    }
    render() {
      return (
        <div className="resultBody">
            <div className="titleSection">
                <a href={"/article/" + this.props.id} className="title">{this.props.title}</a> <br/>
                <span className="date">{this.props.date}</span>
            </div>
            <div className="summary">
                <span>{this.props.summary}</span>
            </div>
        </div>
      );
    }
}
